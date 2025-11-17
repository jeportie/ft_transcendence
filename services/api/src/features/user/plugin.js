// AUTO-GENERATED — YOU MAY EDIT
import fp from "fastify-plugin";
import { sql } from "./sqlRegistry.generated.js";
import { adminRoutes } from "./admin/handler.js";
import { userRoutes } from "./user/handler.js";

export default fp(async function userPlugin(parent) {

    await parent.register(async function(scoped) {
        scoped.decorate("sql", sql);

        // AUTO-REGISTER ROUTES START
        await scoped.register(adminRoutes);
        await scoped.register(userRoutes);
        // AUTO-REGISTER ROUTES END

    }, { prefix: "/api/user" });
});
