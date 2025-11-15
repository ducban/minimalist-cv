# Deployment Guide

## Table of Contents

- [Overview](#overview)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [AWS Deployment](#aws-deployment)
- [Google Cloud Platform](#google-cloud-platform)
- [Azure Deployment](#azure-deployment)
- [Environment Variables](#environment-variables)
- [Domain Configuration](#domain-configuration)
- [SSL/TLS Setup](#ssltls-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring and Logging](#monitoring-and-logging)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers multiple deployment strategies for the Minimalist CV application. Choose the deployment method that best fits your needs:

| Method | Best For | Difficulty | Cost | Time to Deploy |
|--------|----------|------------|------|----------------|
| **Vercel** | Quick deployment, auto-scaling | Easy | Free tier | 5 minutes |
| **Docker** | Self-hosting, full control | Medium | Variable | 15 minutes |
| **AWS** | Enterprise, custom infrastructure | Hard | Pay-as-you-go | 30-60 minutes |
| **GCP** | Google Cloud users | Hard | Pay-as-you-go | 30-60 minutes |
| **Azure** | Microsoft ecosystem | Hard | Pay-as-you-go | 30-60 minutes |

**Recommended**: Start with Vercel for simplest deployment, use Docker for self-hosting.

---

## Pre-Deployment Checklist

Before deploying, ensure you've completed these steps:

### Code Quality

- [ ] All TypeScript errors resolved
  ```bash
  bun run build
  ```

- [ ] Linting passes without errors
  ```bash
  bun check
  ```

- [ ] No console errors or warnings
  ```bash
  # Check in browser console after running:
  bun dev
  ```

### Content Review

- [ ] Resume data is accurate in `src/data/resume-data.tsx`
- [ ] All links are valid (contact, social, projects)
- [ ] Profile image URL is accessible
- [ ] Personal information is correct

### Testing

- [ ] Page loads correctly locally
  ```bash
  bun dev
  # Visit: http://localhost:3000
  ```

- [ ] Print preview looks good
  ```
  Press Cmd+P / Ctrl+P in browser
  ```

- [ ] GraphQL endpoint works
  ```
  Visit: http://localhost:3000/graphql
  ```

- [ ] Mobile responsive (test in Chrome DevTools)
- [ ] All sections render without errors

### Security

- [ ] No sensitive data in code (API keys, passwords)
- [ ] Environment variables properly configured
- [ ] Security headers enabled (check `next.config.js`)

### Performance

- [ ] Run Lighthouse audit
  ```bash
  # Build production version first
  bun run build
  bun start
  # Then run Lighthouse in Chrome DevTools
  ```

- [ ] Target scores > 90 for all metrics
- [ ] Images optimized
- [ ] Bundle size reasonable (< 300KB)

---

## Vercel Deployment

**Recommended for**: Quick deployment, zero configuration, automatic scaling

### Prerequisites

- GitHub, GitLab, or Bitbucket account
- Vercel account (free tier available)

### Step 1: Push Code to Git

```bash
# Initialize git if not already done
git init

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/minimalist-cv.git

# Commit and push
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Step 2: Import Project to Vercel

**Option A: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel auto-detects Next.js configuration
5. Click **"Deploy"**

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? [Y]
# - Which scope? [Your account]
# - Link to existing project? [N]
# - Project name? [minimalist-cv]
# - Directory? [./]
# - Override settings? [N]
```

### Step 3: Configure Build Settings

Vercel should auto-detect these settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Build Command** | `bun run build` or `next build` |
| **Output Directory** | `.next` |
| **Install Command** | `bun install` or `npm install` |
| **Development Command** | `bun dev` or `next dev` |

### Step 4: Deploy

```bash
# Production deployment
vercel --prod

# Or push to main branch (auto-deploys)
git push origin main
```

### Step 5: Verify Deployment

1. Visit the deployment URL (e.g., `https://your-project.vercel.app`)
2. Test all functionality:
   - Page loads correctly
   - All sections visible
   - GraphQL endpoint works (`/graphql`)
   - Print preview looks good
   - Mobile responsive

### Environment Variables (Vercel)

```bash
# Set via CLI
vercel env add NODE_ENV production

# Or via dashboard:
# Settings → Environment Variables
```

**Note**: This project has no required environment variables.

### Continuous Deployment

Vercel automatically deploys when you push to Git:

- **Production**: Pushes to `main` branch
- **Preview**: Pull requests get preview deployments

### Custom Domain

See [Domain Configuration](#domain-configuration) section below.

---

## Docker Deployment

**Recommended for**: Self-hosting, full control, custom infrastructure

### Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose (included with Docker Desktop)

### Step 1: Build Docker Image

```bash
# Build the image
docker compose build

# Or build manually:
docker build -t minimalist-cv .
```

**Build process** (using Bun):
1. Install dependencies with `bun install`
2. Build Next.js app with `bun run build`
3. Create optimized production image

### Step 2: Run Container

```bash
# Using Docker Compose (recommended)
docker compose up -d

# Or run manually:
docker run -d \
  -p 3000:3000 \
  --name minimalist-cv \
  -e NODE_ENV=production \
  minimalist-cv
```

### Step 3: Verify

```bash
# Check container is running
docker ps

# View logs
docker compose logs -f

# Test the application
curl http://localhost:3000
```

Visit: http://localhost:3000

### Step 4: Production Setup

**With Nginx Reverse Proxy**:

```nginx
# /etc/nginx/sites-available/cv.conf

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/cv.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Docker Compose Configuration

**Full `docker-compose.yaml`**:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Docker Commands Reference

```bash
# Build
docker compose build

# Start
docker compose up -d

# Stop
docker compose down

# Restart
docker compose restart

# View logs
docker compose logs -f

# Execute command in container
docker compose exec app sh

# Update to latest code
git pull
docker compose build
docker compose up -d
```

### Multi-Stage Build Optimization

The Dockerfile uses multi-stage builds for smaller images:

- **Stage 1** (Build): Full Bun environment
- **Stage 2** (Production): Minimal Alpine image

**Result**: Image size ~150MB (vs ~800MB without multi-stage)

---

## AWS Deployment

**Recommended for**: Enterprise deployments, custom infrastructure

### Option 1: AWS Elastic Beanstalk

**Simplest AWS deployment method**

#### Prerequisites

```bash
# Install EB CLI
pip install awsebcli

# Configure AWS credentials
aws configure
```

#### Deployment Steps

```bash
# Initialize EB application
eb init

# Select:
# - Region: (your region)
# - Application name: minimalist-cv
# - Platform: Docker
# - SSH: (optional)

# Create environment and deploy
eb create minimalist-cv-prod

# Open in browser
eb open
```

#### Update Deployment

```bash
# Deploy new version
eb deploy

# Check status
eb status

# View logs
eb logs
```

#### Configuration

**`.elasticbeanstalk/config.yml`**:
```yaml
branch-defaults:
  main:
    environment: minimalist-cv-prod
global:
  application_name: minimalist-cv
  default_platform: Docker
  default_region: us-east-1
```

---

### Option 2: AWS ECS (Fargate)

**For containerized deployments with auto-scaling**

#### Step 1: Push Image to ECR

```bash
# Create ECR repository
aws ecr create-repository --repository-name minimalist-cv

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and tag image
docker build -t minimalist-cv .
docker tag minimalist-cv:latest \
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/minimalist-cv:latest

# Push to ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/minimalist-cv:latest
```

#### Step 2: Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster --cluster-name minimalist-cv-cluster
```

#### Step 3: Create Task Definition

**`task-definition.json`**:
```json
{
  "family": "minimalist-cv",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "minimalist-cv",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/minimalist-cv:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ]
    }
  ]
}
```

Register task:
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

#### Step 4: Create Service

```bash
aws ecs create-service \
  --cluster minimalist-cv-cluster \
  --service-name minimalist-cv-service \
  --task-definition minimalist-cv \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

---

### Option 3: AWS Amplify

**For Git-based deployments**

#### Step 1: Connect Repository

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Select: Amazon CloudFront and S3
```

#### Step 2: Deploy

```bash
amplify publish
```

**Auto-deployment**: Pushes to Git trigger automatic deployments

---

## Google Cloud Platform

**Recommended for**: Google Cloud users, serverless deployment

### Option 1: Cloud Run

**Best for**: Serverless container deployment

#### Step 1: Build and Push Image

```bash
# Set project
gcloud config set project YOUR_PROJECT_ID

# Build with Cloud Build
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/minimalist-cv

# Or build locally and push:
docker build -t gcr.io/YOUR_PROJECT_ID/minimalist-cv .
docker push gcr.io/YOUR_PROJECT_ID/minimalist-cv
```

#### Step 2: Deploy to Cloud Run

```bash
gcloud run deploy minimalist-cv \
  --image gcr.io/YOUR_PROJECT_ID/minimalist-cv \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1
```

#### Step 3: Get URL

```bash
gcloud run services describe minimalist-cv \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)'
```

---

### Option 2: App Engine

```bash
# Create app.yaml
cat > app.yaml << EOF
runtime: nodejs18
env: standard
instance_class: F1

handlers:
  - url: /.*
    script: auto
    secure: always
EOF

# Deploy
gcloud app deploy
```

---

### Option 3: GKE (Kubernetes)

For advanced deployments with Kubernetes orchestration.

**`deployment.yaml`**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minimalist-cv
spec:
  replicas: 3
  selector:
    matchLabels:
      app: minimalist-cv
  template:
    metadata:
      labels:
        app: minimalist-cv
    spec:
      containers:
      - name: minimalist-cv
        image: gcr.io/YOUR_PROJECT_ID/minimalist-cv:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

Deploy:
```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

---

## Azure Deployment

### Option 1: Azure App Service

```bash
# Install Azure CLI
# https://docs.microsoft.com/cli/azure/install-azure-cli

# Login
az login

# Create resource group
az group create --name minimalist-cv-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name minimalist-cv-plan \
  --resource-group minimalist-cv-rg \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --resource-group minimalist-cv-rg \
  --plan minimalist-cv-plan \
  --name minimalist-cv-app \
  --runtime "NODE|18-lts"

# Deploy from Git
az webapp deployment source config \
  --name minimalist-cv-app \
  --resource-group minimalist-cv-rg \
  --repo-url https://github.com/YOUR_USERNAME/minimalist-cv \
  --branch main \
  --manual-integration
```

---

### Option 2: Azure Container Instances

```bash
# Create container instance
az container create \
  --resource-group minimalist-cv-rg \
  --name minimalist-cv-container \
  --image YOUR_REGISTRY/minimalist-cv:latest \
  --dns-name-label minimalist-cv \
  --ports 3000 \
  --environment-variables NODE_ENV=production
```

---

## Environment Variables

### Current Project

**No environment variables required** - the application runs without any configuration.

### Optional Variables

If you need to add environment variables in the future:

**Local Development** (`.env.local`):
```bash
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Production**:
```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Setting Environment Variables

**Vercel**:
```bash
vercel env add VARIABLE_NAME
```

**Docker**:
```yaml
# docker-compose.yaml
environment:
  - VARIABLE_NAME=value
```

**AWS Elastic Beanstalk**:
```bash
eb setenv VARIABLE_NAME=value
```

**Google Cloud Run**:
```bash
gcloud run services update minimalist-cv \
  --update-env-vars VARIABLE_NAME=value
```

---

## Domain Configuration

### Custom Domain Setup

#### Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `cv.yourdomain.com`)
3. Configure DNS with your registrar:

**Option A: CNAME (Recommended)**
```
Type: CNAME
Name: cv (or @)
Value: cname.vercel-dns.com
```

**Option B: A Record**
```
Type: A
Name: @ (or subdomain)
Value: 76.76.21.21
```

4. Wait for DNS propagation (5 minutes - 48 hours)
5. Vercel automatically provisions SSL certificate

---

#### Docker (Self-Hosted)

**Prerequisites**: Domain pointing to your server's IP

1. **Update DNS Records**:
   ```
   Type: A
   Name: @
   Value: YOUR_SERVER_IP
   ```

2. **Configure Nginx** (see Docker section)

3. **Setup SSL with Let's Encrypt**:
   ```bash
   # Install Certbot
   sudo apt-get install certbot python3-certbot-nginx

   # Obtain certificate
   sudo certbot --nginx -d your-domain.com
   ```

---

#### AWS (Route 53)

```bash
# Create hosted zone
aws route53 create-hosted-zone --name your-domain.com

# Create record set
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_ZONE_ID \
  --change-batch file://change-batch.json
```

**`change-batch.json`**:
```json
{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "your-domain.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "YOUR_CLOUDFRONT_DISTRIBUTION.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}
```

---

## SSL/TLS Setup

### Automatic SSL (Vercel)

Vercel automatically provisions SSL certificates via Let's Encrypt:
- **Issuance**: Automatic on domain verification
- **Renewal**: Automatic before expiration
- **Wildcard Support**: Yes (for *.your-domain.com)

**No configuration needed** ✅

---

### Manual SSL (Self-Hosted)

#### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain and install certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

**Nginx Configuration** (auto-updated by Certbot):
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';

    # ... rest of configuration
}
```

---

#### Custom SSL Certificate

If you have a purchased SSL certificate:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/your-certificate.crt;
    ssl_certificate_key /path/to/your-private-key.key;
    ssl_trusted_certificate /path/to/ca-bundle.crt;

    # ... rest of configuration
}
```

---

## CI/CD Pipeline

### GitHub Actions

**`.github/workflows/deploy.yml`**:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Lint
        run: bun check

      - name: Build
        run: bun run build

  deploy-vercel:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-docker:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          push: true
          tags: your-registry/minimalist-cv:latest
```

---

### GitLab CI

**`.gitlab-ci.yml`**:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: oven/bun:latest
  script:
    - bun install
    - bun check
    - bun run build

build-docker:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy-production:
  stage: deploy
  script:
    - echo "Deploy to production"
  only:
    - main
```

---

## Monitoring and Logging

### Vercel Analytics

**Built-in analytics** (free):
- Page views
- Performance metrics (Core Web Vitals)
- Top pages
- Traffic sources

**Enable**:
Already enabled via `@vercel/analytics` in `layout.tsx`

**View**: Vercel Dashboard → Analytics

---

### Docker Logging

**View logs**:
```bash
# Live logs
docker compose logs -f

# Last 100 lines
docker compose logs --tail=100

# Filter by service
docker compose logs app
```

**Configure logging driver** (`docker-compose.yaml`):
```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

### Application Performance Monitoring (APM)

**Recommended Tools**:

1. **Sentry** (Error Tracking)
   ```bash
   npm install @sentry/nextjs
   ```

2. **LogRocket** (Session Replay)
   ```bash
   npm install logrocket
   ```

3. **New Relic** (Full APM)
   ```bash
   npm install newrelic
   ```

---

### Uptime Monitoring

**Free Services**:
- [UptimeRobot](https://uptimerobot.com) - 50 monitors free
- [Pingdom](https://www.pingdom.com) - Free tier
- [StatusCake](https://www.statuscake.com) - Free tier

**Setup**:
1. Add your production URL
2. Set check interval (5 minutes)
3. Configure email/SMS alerts

---

## Rollback Procedures

### Vercel Rollback

**Via Dashboard**:
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

**Via CLI**:
```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback DEPLOYMENT_URL
```

**Instant rollback** - No downtime

---

### Docker Rollback

```bash
# Tag current version before deploying
docker tag minimalist-cv:latest minimalist-cv:backup

# If new version fails, rollback
docker stop minimalist-cv
docker rm minimalist-cv
docker run -d --name minimalist-cv minimalist-cv:backup
```

**Using Git tags**:
```bash
# Tag releases
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0

# Rollback to previous version
git checkout v1.0.0
docker compose build
docker compose up -d
```

---

### AWS Elastic Beanstalk Rollback

```bash
# List application versions
aws elasticbeanstalk describe-application-versions \
  --application-name minimalist-cv

# Deploy previous version
aws elasticbeanstalk update-environment \
  --environment-name minimalist-cv-prod \
  --version-label VERSION_LABEL
```

---

## Troubleshooting

### Issue 1: Build Fails

**Symptoms**:
```
Error: Build failed
```

**Solutions**:

1. **Check TypeScript errors**:
   ```bash
   bun run build
   # Fix any TypeScript errors shown
   ```

2. **Clear build cache**:
   ```bash
   rm -rf .next node_modules bun.lock
   bun install
   bun run build
   ```

3. **Check Node.js version**:
   ```bash
   node --version  # Should be 18.x or higher
   ```

---

### Issue 2: Container Won't Start

**Symptoms**:
```
docker: Error response from daemon: Container exits immediately
```

**Solutions**:

1. **Check logs**:
   ```bash
   docker logs minimalist-cv
   ```

2. **Verify build**:
   ```bash
   docker build -t minimalist-cv . --progress=plain
   ```

3. **Test locally**:
   ```bash
   docker run -it minimalist-cv sh
   # Inside container:
   bun start
   ```

---

### Issue 3: Domain Not Resolving

**Symptoms**: Domain doesn't load or shows "Site not found"

**Solutions**:

1. **Check DNS propagation**:
   ```bash
   nslookup your-domain.com
   dig your-domain.com
   ```

2. **Verify DNS records** (use [DNS Checker](https://dnschecker.org))

3. **Wait for propagation** (up to 48 hours)

4. **Clear browser cache**:
   ```
   Chrome: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   ```

---

### Issue 4: SSL Certificate Errors

**Symptoms**: "Your connection is not private" error

**Solutions**:

1. **Vercel**: SSL auto-provisions, wait 5-10 minutes

2. **Self-hosted**: Verify certificate:
   ```bash
   sudo certbot certificates
   ```

3. **Renew certificate**:
   ```bash
   sudo certbot renew
   sudo systemctl reload nginx
   ```

---

### Issue 5: GraphQL Endpoint 500 Error

**Symptoms**: `/graphql` returns 500 Internal Server Error

**Solutions**:

1. **Check server logs** (Vercel/Docker)

2. **Verify TypeGraphQL decorators**:
   ```typescript
   // Ensure reflect-metadata is imported first
   import 'reflect-metadata';
   ```

3. **Test locally**:
   ```bash
   bun dev
   # Visit: http://localhost:3000/graphql
   ```

---

### Issue 6: Slow Performance

**Symptoms**: Page loads slowly (> 5 seconds)

**Solutions**:

1. **Run Lighthouse audit**:
   - Identify bottlenecks
   - Check image sizes
   - Verify bundle size

2. **Enable caching**:
   - Check CDN settings
   - Verify cache headers

3. **Scale up resources**:
   - Vercel: Upgrade plan
   - Docker: Increase CPU/RAM
   - AWS: Use larger instance type

---

## Deployment Comparison

### Cost Comparison (Monthly)

| Provider | Free Tier | Paid Tier | Notes |
|----------|-----------|-----------|-------|
| **Vercel** | 100GB bandwidth<br>100K invocations | $20/mo (Pro) | Best value for small-medium traffic |
| **Docker (VPS)** | N/A | $5-20/mo (DigitalOcean, Linode) | Full control, more setup |
| **AWS Elastic Beanstalk** | 750 hours free (1 yr) | ~$15-30/mo | Good for AWS users |
| **Google Cloud Run** | 2M requests free | ~$10-25/mo | Pay per request |
| **Azure App Service** | N/A | ~$15-30/mo | Good for Azure users |

### Performance Comparison

| Provider | Cold Start | Response Time | Global CDN |
|----------|------------|---------------|------------|
| **Vercel** | ~50ms | 100-200ms | ✅ Yes (free) |
| **Docker (VPS)** | N/A (always on) | 50-100ms | ❌ No (setup separately) |
| **AWS** | ~200ms | 100-300ms | ✅ Yes (CloudFront) |
| **GCP** | ~200ms | 100-300ms | ✅ Yes |
| **Azure** | ~200ms | 100-300ms | ✅ Yes |

---

## Recommended Deployment Strategy

### For Personal Use

1. **Start with**: Vercel (free tier)
2. **Reason**: Zero configuration, automatic scaling, free SSL
3. **Cost**: $0/month

### For Small Business

1. **Start with**: Vercel (Pro plan) or Docker on VPS
2. **Reason**: Good performance, reasonable cost
3. **Cost**: $5-20/month

### For Enterprise

1. **Start with**: AWS/GCP/Azure with custom infrastructure
2. **Reason**: Full control, compliance requirements
3. **Cost**: $50-200/month

---

## Next Steps After Deployment

1. **Set up monitoring**:
   - Enable Vercel Analytics
   - Add uptime monitoring
   - Configure error tracking

2. **Configure custom domain**:
   - Purchase domain
   - Set up DNS
   - Enable SSL

3. **Optimize performance**:
   - Run Lighthouse audit
   - Implement improvements
   - Monitor Core Web Vitals

4. **Set up CI/CD**:
   - GitHub Actions
   - Automated testing
   - Automated deployments

5. **Regular maintenance**:
   - Update dependencies monthly
   - Review security advisories
   - Update resume content

---

**Document Version**: 1.0
**Last Updated**: 2025-11-15
**Maintained By**: Development Team
