# Azure Web App for Containers Setup Guide

This guide walks through setting up Azure Container Registry (ACR) and Azure Web App for Containers for the AdmuseEasy application.

## Prerequisites

- Azure CLI installed and logged in
- Azure subscription with permissions to create resources
- GitHub repository with Actions enabled

## Step 1: Create Azure Container Registry

### Using Azure Portal
1. Navigate to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" → "Containers" → "Container Registry"
3. Fill in the details:
   - **Registry name**: `admuseregistry` (must be globally unique)
   - **Resource group**: Create new or use existing
   - **Location**: Choose your preferred region
   - **SKU**: Basic (for development) or Standard (for production)
4. Click "Review + Create" → "Create"

### Using Azure CLI
```bash
# Create resource group
az group create --name rg-admuse-easy --location eastus

# Create container registry
az acr create \
  --resource-group rg-admuse-easy \
  --name admuseregistry \
  --sku Basic \
  --admin-enabled true

# Get login credentials
az acr credential show --name admuseregistry
```

## Step 2: Create Azure Web App for Containers

### Using Azure Portal
1. Navigate to "Create a resource" → "Web" → "Web App"
2. Fill in the details:
   - **App name**: `admuse-easy-container` (must be globally unique)
   - **Resource group**: Same as ACR
   - **Publish**: Docker Container
   - **Operating System**: Linux
   - **Region**: Same as ACR
   - **App Service Plan**: Create new (B1 Basic or higher)

3. In the **Docker** tab:
   - **Options**: Single Container
   - **Image Source**: Azure Container Registry
   - **Registry**: Select your registry
   - **Image**: admuse-easy
   - **Tag**: latest

4. Click "Review + Create" → "Create"

### Using Azure CLI
```bash
# Create app service plan
az appservice plan create \
  --name plan-admuse-easy \
  --resource-group rg-admuse-easy \
  --sku B1 \
  --is-linux

# Create web app for containers
az webapp create \
  --resource-group rg-admuse-easy \
  --plan plan-admuse-easy \
  --name admuse-easy-container \
  --deployment-container-image-name admuseregistry.azurecr.io/admuse-easy:latest
```

## Step 3: Configure GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### Container Registry Secrets
```
AZURE_REGISTRY_USERNAME=admuseregistry
AZURE_REGISTRY_PASSWORD=[Get from ACR access keys]
```

### Web App Secrets
```
AZURE_WEBAPP_PUBLISH_PROFILE_CONTAINER=[Download from Web App]
AZURE_RESOURCE_GROUP=rg-admuse-easy
```

### Application Secrets
```
MONGODB_URI=mongodb+srv://your-mongodb-connection
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_API_KEY=your-google-gemini-api-key
SENTRY_DSN=your-sentry-dsn
```

### Optional Sentry Secrets (for deployment notifications)
```
SENTRY_ORG=your-sentry-organization
SENTRY_PROJECT=your-sentry-project
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

## Step 4: Configure Web App Environment Variables

Set these environment variables in your Azure Web App:

### In Azure Portal
1. Go to your Web App → Configuration → Application settings
2. Add these settings:

```
NODE_ENV=production
PORT=80
MONGODB_URI=[Your MongoDB connection string]
GOOGLE_CLIENT_ID=[Your Google OAuth client ID]
GOOGLE_CLIENT_SECRET=[Your Google OAuth client secret]
JWT_SECRET=[Your JWT secret]
GOOGLE_API_KEY=[Your Google Gemini API key]
SENTRY_DSN=[Your Sentry DSN]
WEBSITES_PORT=5000
```

### Using Azure CLI
```bash
az webapp config appsettings set \
  --resource-group rg-admuse-easy \
  --name admuse-easy-container \
  --settings \
    NODE_ENV=production \
    PORT=80 \
    WEBSITES_PORT=5000 \
    MONGODB_URI="your-mongodb-uri" \
    GOOGLE_CLIENT_ID="your-google-client-id" \
    GOOGLE_CLIENT_SECRET="your-google-client-secret" \
    JWT_SECRET="your-jwt-secret" \
    GOOGLE_API_KEY="your-google-api-key" \
    SENTRY_DSN="your-sentry-dsn"
```

## Step 5: Configure Container Registry Integration

### In Azure Portal
1. Go to Web App → Deployment Center
2. Choose "Container Registry" as source
3. Select your Azure Container Registry
4. Configure:
   - **Registry**: admuseregistry.azurecr.io
   - **Image**: admuse-easy
   - **Tag**: latest
5. Enable "Continuous deployment" to auto-deploy on new images

### Using Azure CLI
```bash
# Configure container settings
az webapp config container set \
  --name admuse-easy-container \
  --resource-group rg-admuse-easy \
  --docker-custom-image-name admuseregistry.azurecr.io/admuse-easy:latest \
  --docker-registry-server-url https://admuseregistry.azurecr.io \
  --docker-registry-server-user admuseregistry \
  --docker-registry-server-password [ACR-PASSWORD]

# Enable continuous deployment
az webapp deployment container config \
  --name admuse-easy-container \
  --resource-group rg-admuse-easy \
  --enable-cd true
```

## Step 6: Set Up Health Checks

### Configure in Azure Portal
1. Go to Web App → Health check
2. Enable health check
3. Set path to: `/api/health`
4. Configure intervals and thresholds

### Using Azure CLI
```bash
az webapp config set \
  --resource-group rg-admuse-easy \
  --name admuse-easy-container \
  --health-check-path "/api/health"
```

## Step 7: Enable Logging and Monitoring

### Application Insights
```bash
# Create Application Insights
az monitor app-insights component create \
  --app admuse-easy-insights \
  --location eastus \
  --resource-group rg-admuse-easy

# Link to Web App
az webapp config appsettings set \
  --resource-group rg-admuse-easy \
  --name admuse-easy-container \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=[INSTRUMENTATION-KEY]
```

### Container Logs
```bash
# Enable container logging
az webapp log config \
  --name admuse-easy-container \
  --resource-group rg-admuse-easy \
  --docker-container-logging filesystem
```

## Step 8: Test Deployment

### Manual Build and Push
```bash
# Build and tag image locally
docker build -t admuseregistry.azurecr.io/admuse-easy:latest .

# Push to ACR
az acr login --name admuseregistry
docker push admuseregistry.azurecr.io/admuse-easy:latest

# Restart web app to pull new image
az webapp restart --name admuse-easy-container --resource-group rg-admuse-easy
```

### Verify Deployment
1. Check health endpoint: `https://admuse-easy-container.azurewebsites.net/api/health`
2. Test application functionality
3. Monitor logs: `az webapp log tail --name admuse-easy-container --resource-group rg-admuse-easy`

## Benefits of Container Deployment

### For Your Portfolio
- **Enterprise Architecture**: Demonstrates containerization skills
- **Scalability**: Easy horizontal scaling with Azure Container Instances
- **DevOps Mastery**: Complete CI/CD pipeline with container registry
- **Production Ready**: Health checks, logging, monitoring integration

### Technical Advantages
- **Consistency**: Same environment dev to production
- **Isolation**: Better resource management and security
- **Versioning**: Tagged images for rollback capabilities
- **Performance**: Optimized container startup and resource usage

## Troubleshooting

### Common Issues
1. **Container fails to start**: Check environment variables and logs
2. **Health check fails**: Verify `/api/health` endpoint accessibility
3. **Push fails**: Ensure ACR credentials are correct
4. **App not accessible**: Check port configuration (WEBSITES_PORT=5000)

### Useful Commands
```bash
# View container logs
az webapp log tail --name admuse-easy-container --resource-group rg-admuse-easy

# Check container status
az webapp show --name admuse-easy-container --resource-group rg-admuse-easy --query state

# Restart application
az webapp restart --name admuse-easy-container --resource-group rg-admuse-easy

# View ACR repositories
az acr repository list --name admuseregistry

# View image tags
az acr repository show-tags --name admuseregistry --repository admuse-easy
```

## Next Steps

1. **Enable Azure CLI in GitHub Actions** for advanced deployment control
2. **Set up staging environments** with different container tags
3. **Implement blue-green deployment** for zero-downtime updates
4. **Add container scanning** for security vulnerabilities
5. **Configure auto-scaling** based on metrics

## Security Best Practices

- Use managed identity instead of service principal where possible
- Enable ACR token authentication for enhanced security
- Implement network restrictions for ACR access
- Regular security scanning of container images
- Use Azure Key Vault for sensitive configuration values

---

**This setup demonstrates enterprise-level containerization skills perfect for your job application portfolio!** 🚀