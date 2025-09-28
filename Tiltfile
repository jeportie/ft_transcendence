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

# Frontend service
docker_build(
    'frontend',
    'services/frontend',
    dockerfile='services/frontend/Dockerfile',
    live_update=[
        sync('services/frontend/src', '/app/src'),
        sync('services/frontend/public', '/app/public'),
        run('npm run build:css', trigger=['services/frontend/src', 'services/frontend/input.css']),
        run('npm run build:js', trigger=['services/frontend/src/**/*.ts', 'services/frontend/src/**/*.js']),
        ],
)
