src/
├── config/        # config.js, envParser.js, maybe per-env files
├── db/            # migrations, connection, seeders
├── plugins/       # Fastify plugins
├── routes/        # HTTP routes only (thin adapters)
├── services/      # business logic (was auth/, oauth/)
├── schemas/       # JSON Schemas / OpenAPI docs
└── app.js / server.js
