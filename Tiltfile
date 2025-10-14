# Use your docker-compose services
docker_compose('docker-compose.yml')

# API service
docker_build(
    'api',
    'services/api',
    dockerfile='services/api/Dockerfile',
    live_update=[
        sync('services/api/src', '/app/src'),
        run('npm run dev', trigger=['services/api/src']),
    ],
)

# FRONTEND SERVICE — ultra fast live update (modern Tilt syntax)
docker_build(
    'frontend',
    'services/frontend',
    dockerfile='services/frontend/Dockerfile',

    # Live-update instead of full rebuild
    live_update=[
        # ⚡ Sync editable sources directly into container
        sync('services/frontend/src', '/app/src'),

        # 🧱 Optional incremental rebuilds inside container
        run('npm run build:js', trigger=['services/frontend/src/**/*.ts', 'services/frontend/src/**/*.js']),
        run('npm run build:css', trigger=['services/frontend/src/**/*.css', 'services/frontend/input.css']),
    ],

    # 🚫 Ignore generated / heavy paths so Tilt doesn’t re-trigger
    ignore=[
        'services/frontend/public/**',
        'services/frontend/node_modules/**',
        'services/frontend/.cache/**',
    ],
)
