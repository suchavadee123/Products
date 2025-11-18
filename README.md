# Products Project

## Project Structure

- **Frontend**: Angular (`products.Client/`)
- **Backend**: .NET 8.0 Web API (`products.Server/`)
- **Database**: PostgreSQL

## Frontend

Angular 20:
- Product management interface
- Barcode generation (`bwip-js`)
- Form validation and routing

**Setup:**
```bash
cd products.Client
npm install
npm start
```

**Build:**
```bash
npm run build
```

## Backend

.NET 8.0 Web API:
- Entity Framework Core with PostgreSQL
- MediatR (CQRS)
- RESTful API endpoints

**Setup:**
```bash
cd products.Server
dotnet restore
dotnet run
```

## SQL Script

`products.sql` - Database schema:

**products** table:
- `id` (bigserial primary key)
- `product_code` (varchar, unique)
- `product_code_clean` (varchar, indexed)
- `barcode_type` (varchar)
- `created_at` and `updated_at` (timestamps)


## Build and Push Scripts

Docker scripts for GitHub Container Registry.

**Main Script:**
```bash
./build-and-push.sh [version] [github-username]
```
Builds and pushes both images.

**Individual Scripts:**
- `build-and-push-frontend.sh` - Frontend only
- `build-and-push-backend.sh` - Backend only

**Usage:**
```bash
./build-and-push.sh v1.0.0 your-username

# Or set environment variable
export GITHUB_USERNAME=your-username
./build-and-push.sh v1.0.0
```

**Prerequisites:**
- Docker installed and running
- Login to GitHub Container Registry:
  ```bash
  echo $GITHUB_TOKEN | docker login ghcr.io -u your-username --password-stdin
  ```

**Docker Images:**
- Frontend: `ghcr.io/[username]/products-frontend:[version]`
- Backend: `ghcr.io/[username]/products-backend:[version]`
