# Vaxen Frontend Infrastructure

This directory contains all infrastructure configuration files for the Vaxen Frontend application, organized by environment.

## Directory Structure

```
infra/
├── dev/                    # Development environment
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .env.example
├── testing/                # Testing/Staging environment
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .env.example
├── production/             # Production environment
│   ├── Dockerfile
│   ├── fly.toml
│   └── .env.example
├── Makefile               # Build & deployment automation
└── README.md             # This file
```

## Environments

### Development (`dev/`)

Local development environment with hot-reload and debugging capabilities.

**Features:**
- Hot module reloading
- File watching
- Volume mounting for live code updates
- Runs on port `3000`
- Connects to local backend at `http://host.docker.internal:8080`

**Quick Start:**
```bash
# Setup environment
make setup-dev

# Start development server
make dev

# View logs
make logs ENV=dev

# Open shell
make shell ENV=dev
```

### Testing (`testing/`)

Testing/staging environment that mimics production setup.

**Features:**
- Production build
- Optimized for testing
- Health checks enabled
- Runs on port `3001`
- Connects to testing backend at `https://api-test.vaxen.com`

**Quick Start:**
```bash
# Setup environment
make setup-testing

# Start testing environment
make test

# Deploy to testing
make deploy-test

# View logs
make logs ENV=testing
```

### Production (`production/`)

Production environment optimized for performance and deployed to Fly.io.

**Features:**
- Multi-stage build for minimal image size
- Security hardening (non-root user)
- Health checks
- Auto-scaling support
- CDN integration
- Deployed to Fly.io

**Quick Start:**
```bash
# Deploy to production
make prod

# Or use the full command
make deploy-prod
```

## Makefile Commands

Run `make help` to see all available commands.

### Common Commands

```bash
# Development
make dev                    # Start development environment
make setup-dev             # Setup dev environment with .env

# Testing
make test                  # Start testing environment
make setup-testing         # Setup testing environment with .env.test
make deploy-test          # Deploy to testing

# Production
make prod                  # Deploy to production (Fly.io)
make deploy-prod          # Same as above

# General (works with ENV parameter)
make build ENV=dev        # Build Docker image
make up ENV=testing       # Start containers
make down ENV=dev         # Stop containers
make logs ENV=production  # View logs
make shell ENV=dev        # Open shell in container
make restart ENV=testing  # Restart containers
make clean ENV=dev        # Remove containers & images
make rebuild ENV=testing  # Full rebuild
make status               # Show container status
make health              # Check health endpoint
```

## Environment Variables

Each environment has an `.env.example` file. Copy it to create your actual environment file:

```bash
# Development
cp infra/dev/.env.example .env

# Testing
cp infra/testing/.env.example .env.test

# Production (managed via Fly.io secrets)
fly secrets set KEY=VALUE
```

### Key Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development`, `production` |
| `NEXT_PUBLIC_API_URL` | Frontend API URL | `http://localhost:8080` |
| `BACKEND_BASE_URL` | Server-side backend URL | `http://host.docker.internal:8080` |
| `BACKEND_REQUEST_ACCESS_PATH` | Request access endpoint | `/api/request-access` |
| `BACKEND_FAQS_PATH` | FAQs endpoint | `/api/landing/faqs` |

## Development Workflow

1. **Setup:**
   ```bash
   make setup-dev
   ```

2. **Start Development:**
   ```bash
   make dev
   ```

3. **Make Changes:**
   - Edit files in `src/`
   - Changes auto-reload in the browser

4. **View Logs:**
   ```bash
   make logs ENV=dev
   ```

5. **Debug:**
   ```bash
   make shell ENV=dev
   ```

## Testing Workflow

1. **Build & Start:**
   ```bash
   make test
   ```

2. **Run Tests:**
   ```bash
   npm test
   ```

3. **Deploy to Testing:**
   ```bash
   make deploy-test
   ```

## Production Deployment

### Prerequisites

1. Install Fly.io CLI:
   ```bash
   brew install flyctl  # macOS
   ```

2. Login to Fly.io:
   ```bash
   fly auth login
   ```

3. Set secrets:
   ```bash
   fly secrets set BACKEND_BASE_URL=https://api.vaxen.com
   fly secrets set SESSION_SECRET=your-secret
   ```

### Deploy

```bash
make prod
```

Or manually:
```bash
cd infra/production
fly deploy --config fly.toml --dockerfile Dockerfile
```

### Monitor Production

```bash
# View logs
fly logs

# Check status
fly status

# Open app
fly open

# SSH into instance
fly ssh console
```

## Docker Images

### Development Image
- Base: `node:20-alpine`
- Size: ~500MB (with node_modules)
- Build time: ~2 minutes

### Testing Image
- Base: `node:20-alpine`
- Size: ~200MB (optimized)
- Build time: ~3 minutes

### Production Image
- Base: `node:20-alpine`
- Size: ~150MB (minimal)
- Build time: ~4 minutes
- Multi-stage build
- Security hardened

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -ti:3000 | xargs kill -9

# Or change port in docker-compose.yml
```

### Container Won't Start
```bash
# Check logs
make logs ENV=dev

# Rebuild from scratch
make rebuild ENV=dev
```

### Volume Permission Issues
```bash
# Fix node_modules ownership
docker exec -it vaxen-web-dev chown -R node:node /app/node_modules
```

### Hot Reload Not Working
```bash
# Ensure polling is enabled in .env
CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Testing

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and deploy
        run: make deploy-test
```

## Health Checks

All environments include health check endpoints:

```bash
# Check health
curl http://localhost:3000/api/health

# Or use make command
make health ENV=dev
```

## Security Notes

1. **Never commit `.env` files** - only commit `.env.example`
2. **Use secrets management** for production (Fly.io secrets)
3. **Keep dependencies updated** - run `npm audit` regularly
4. **Review Dockerfile** - ensure no sensitive data in images
5. **Use non-root user** in production containers

## Support

For infrastructure issues:
1. Check logs: `make logs ENV=<env>`
2. Verify environment variables
3. Review Dockerfile for the specific environment
4. Check Docker daemon status

For application issues, see the main project README.
