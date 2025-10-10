// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   metrics.js                                         :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/28                                    //
//   Updated: 2025/10/10 23:36:59 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import fp from "fastify-plugin";
import client from "prom-client";

export default fp(async function metricsPlugin(fastify) {
    const register = new client.Registry();

    // Collect default Node.js process metrics
    client.collectDefaultMetrics({ register });

    // --- 1) Counter: HTTP requests ---
    const httpRequestsTotal = new client.Counter({
        name: "http_requests_total",
        help: "Total number of HTTP requests",
        labelNames: ["method", "route", "status_code"],
    });
    register.registerMetric(httpRequestsTotal);

    // --- 2) Histogram: Request duration ---
    const httpRequestDuration = new client.Histogram({
        name: "http_request_duration_seconds",
        help: "Duration of HTTP requests in seconds",
        labelNames: ["method", "route", "status_code"],
        buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5], // fine-grained for web
    });
    register.registerMetric(httpRequestDuration);

    // Hook: start time
    fastify.addHook("onRequest", (req, _, done) => {
        req.startTime = process.hrtime(); // [seconds, nanoseconds]
        done();
    });

    // Hook: record metrics after response
    fastify.addHook("onResponse", (req, reply, done) => {
        const route = req.routeOptions?.url || req.raw.url;
        const status = reply.statusCode;

        // Counter
        httpRequestsTotal.inc({ method: req.method, route, status_code: status });

        // Duration
        if (req.startTime) {
            const diff = process.hrtime(req.startTime);
            const duration = diff[0] + diff[1] / 1e9;
            httpRequestDuration.observe(
                { method: req.method, route, status_code: status },
                duration
            );
        }

        done();
    });

    // Expose /metrics endpoint
    fastify.get("/metrics", { schema: metricsSchema }, async (_, reply) => {
        reply.type(register.contentType).send(await register.metrics());
    });
});

export const metricsSchema = {
    summary: "Expose Prometheus metrics",
    description:
        "Returns application performance and system metrics in Prometheus text format. \
        This endpoint is intended for scraping by Prometheus or compatible monitoring tools. \
        The response contains metrics about Fastify routes, event loop lag, memory usage, \
        and any custom counters registered via the Prometheus client.",
    tags: ["Monitoring"],
    operationId: "getMetrics",

    response: {
        200: {
            description: "Prometheus metrics successfully retrieved",
            content: {
                "text/plain; version=0.0.4": {
                    schema: {
                        type: "string",
                        example:
                            "# HELP process_cpu_user_seconds_total Total user CPU time spent in seconds\n" +
                            "# TYPE process_cpu_user_seconds_total counter\n" +
                            "process_cpu_user_seconds_total 42.13\n\n" +
                            "# HELP http_requests_total Total number of HTTP requests\n" +
                            "# TYPE http_requests_total counter\n" +
                            "http_requests_total{method=\"get\",route=\"/metrics\",status=\"200\"} 1234\n",
                    },
                },
            },
        },
        500: {
            description: "Failed to collect or render metrics",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["success", "error", "code"],
                        properties: {
                            success: { type: "boolean", example: false },
                            error: {
                                type: "string",
                                example: "Internal metrics collection error",
                            },
                            code: { type: "string", example: "METRICS_COLLECTION_FAILED" },
                        },
                    },
                },
            },
        },
    },
};
