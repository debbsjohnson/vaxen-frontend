# Infrastructure Migration Guide

The infrastructure files have been reorganized for better environment management. This guide helps you migrate from the old structure to the new one.

## What Changed?

### Old Structure
```
/
├── Dockerfile              # Production dockerfile
├── Dockerfile.dev          # Development dockerfile
├── compose.yml            # Docker compose (dev only)
├── fly.toml               # Fly.io config
└── Makefile               # Build commands
```

### New Structure
```
/
├── infra/
│   ├── dev/               # Development environment
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   └── .env.example
│   ├── testing/           # Testing environment
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   └── .env.example
│   ├── production/        # Production environment
│   │   ├── Dockerfile
│   │   ├── fly.toml
│   │   └── .env.example
│   ├── Makefile          # Environment-aware build commands
│   └── README.md         # Infrastructure documentation
└── Makefile              # Delegates to infra/Makefile
```

## Migration Steps

### 1. Update Your Local Environment

**Old command:**
```bash
docker compose up
```

**New command:**
```bash
make dev
# or
make up ENV=dev
```

### 2. Update Environment Variables

**Before:**
Environment variables were in root `.env` file

**Now:**
```bash
# Copy appropriate environment template
cp infra/dev/.env.example .env

# Edit with your values
vim .env
```

### 3. Update Docker Compose References

**Old docker-compose.yml:**
```yaml
build:
  context: .
  dockerfile: Dockerfile.dev
```

**New location:**
```yaml
build:
  context: ../../
  dockerfile: infra/dev/Dockerfile
```

### 4. Update CI/CD Pipelines

**GitHub Actions - Before:**
```yaml
- name: Build
  run: docker compose build
```

**GitHub Actions - After:**
```yaml
- name: Build Dev
  run: make build ENV=dev

- name: Build Testing
  run: make build ENV=testing
```

### 5. Update Fly.io Deployment

**Before:**
```bash
fly deploy --dockerfile Dockerfile
```

**After:**
```bash
# Option 1: Use make command (recommended)
make prod

# Option 2: Manual deployment
fly deploy --config infra/production/fly.toml --dockerfile infra/production/Dockerfile
```

### 6. Update Makefile Commands

| Old Command | New Command | Description |
|------------|-------------|-------------|
| `make build` | `make build ENV=dev` | Build development |
| `make up` | `make dev` or `make up ENV=dev` | Start development |
| `make down` | `make down ENV=dev` | Stop development |
| `make logs` | `make logs ENV=dev` | View dev logs |
| N/A | `make test` | Start testing env |
| N/A | `make prod` | Deploy to production |

## New Features

### 1. Multiple Environments

You can now run different environments simultaneously:

```bash
# Terminal 1: Development
make dev

# Terminal 2: Testing
make test
```

### 2. Environment-Specific Configuration

Each environment has its own configuration:
- Development: Hot reload, debugging, local backend
- Testing: Production build, staging backend, health checks
- Production: Optimized build, CDN, auto-scaling

### 3. Simplified Commands

```bash
make dev      # Start development
make test     # Start testing
make prod     # Deploy to production
```

### 4. Better Documentation

- `infra/README.md` - Complete infrastructure guide
- Environment-specific `.env.example` files
- Inline command help: `make help`

## Breaking Changes

### 1. Port Changes

- **Development**: Still `3000`
- **Testing**: Now `3001` (to avoid conflicts)
- **Production**: `3000` (via Fly.io)

### 2. Volume Mounts

Development volumes are now explicitly defined:
```yaml
volumes:
  - ../../:/app              # Source code
  - /app/node_modules        # Preserve node_modules
  - /app/.next              # Preserve build cache
```

### 3. Environment Variables

New required variables:
- `BACKEND_BASE_URL` - Server-side backend URL
- `BACKEND_*_PATH` - Individual API endpoint paths

See `.env.example` in each environment folder.

## Troubleshooting

### Issue: Old containers still running

**Solution:**
```bash
# Stop old containers
docker compose -f compose.yml down

# Or stop all Docker containers
docker stop $(docker ps -aq)
```

### Issue: Port 3000 in use

**Solution:**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in infra/dev/docker-compose.yml
```

### Issue: Environment variables not loading

**Solution:**
```bash
# Ensure .env file exists
cp infra/dev/.env.example .env

# Rebuild containers
make rebuild ENV=dev
```

### Issue: Volume permission errors

**Solution:**
```bash
# Fix ownership
docker exec -it vaxen-web-dev chown -R node:node /app/node_modules

# Or rebuild from scratch
make clean ENV=dev
make build ENV=dev
```

## Rollback Instructions

If you need to rollback to the old structure:

```bash
# Restore old files
cp infra/.old/* ./

# Use old commands
docker compose up
```

## Need Help?

1. **Check documentation**: `infra/README.md`
2. **View available commands**: `make help`
3. **Check logs**: `make logs ENV=dev`
4. **View container status**: `make status`

## Testing the Migration

Verify everything works:

```bash
# 1. Setup development
make setup-dev

# 2. Start development
make dev

# 3. Check it's running
curl http://localhost:3000/api/health

# 4. View logs
make logs ENV=dev

# 5. Stop
make down ENV=dev
```

## Next Steps

1. ✅ Update your local environment variables
2. ✅ Test with `make dev`
3. ✅ Update CI/CD pipelines
4. ✅ Update deployment scripts
5. ✅ Delete old infrastructure files (optional)

---

**Migration completed?** You can safely delete `infra/.old/` directory:
```bash
rm -rf infra/.old
```
