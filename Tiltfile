# Use your docker-compose services
docker_compose('docker-compose.yml')

local_resource(
  'seed-frontend',
  'docker exec frontend sh -lc "npm run build:css && npm run build:js"',
  deps=['services/frontend/src', 'services/frontend/input.css']
)

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

    # ✅ Only sync source files (no public folder!)
    live_update=[
        sync('services/frontend/src', '/app/src'),
        run('npm run build:css', trigger=['services/frontend/src', 'services/frontend/input.css']),
        run('npm run build:js', trigger=['services/frontend/src/**/*.ts', 'services/frontend/src/**/*.js']),
    ],

    # ✅ Ignore all build outputs so Tilt won’t re-trigger
    ignore=[
        'services/frontend/public/**',
        'services/frontend/node_modules/**',
    ],
)

