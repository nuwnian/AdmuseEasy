# Azure Portal Container Setup Guide

## Current Status
You have Azure Web App "Admuse-Easy" ready for container deployment.

## Step-by-Step Azure Portal Setup

### 1. Create Azure Container Registry
1. In Azure Portal, go to "Create a resource"
2. Search for "Container Registry"
3. Configure:
   - **Subscription**: Your current subscription
   - **Resource group**: `smartmuse` (or create `admuseasy-rg`)
   - **Registry name**: `admuseeasyregistry` (must be globally unique)
   - **Location**: Southeast Asia
   - **SKU**: Basic
   - **Admin user**: Enable

### 2. Configure Web App Container Source
In your Admuse-Easy Deployment Center (current screen):

1. **Source**: Azure Container Registry
2. **Subscription**: Your subscription
3. **Registry**: Select the registry you just created
4. **Image**: `admuseasy`
5. **Tag**: `latest`
6. **Startup Command**: Leave empty (uses Dockerfile CMD)

### 3. Get GitHub Secrets Values

After creating the Container Registry:

1. Go to Container Registry → Access keys
2. Copy these values for GitHub secrets:
   - **Login server** → `AZURE_REGISTRY_USERNAME`
   - **Password** → `AZURE_REGISTRY_PASSWORD`

3. Go to Web App → Deployment Center → Manage publish profile
4. Download and copy content → `AZURE_WEBAPP_PUBLISH_PROFILE_CONTAINER`

5. Set resource group name → `AZURE_RESOURCE_GROUP` = `smartmuse`

### 4. Add GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `AZURE_REGISTRY_USERNAME`: From Container Registry access keys
- `AZURE_REGISTRY_PASSWORD`: From Container Registry access keys  
- `AZURE_WEBAPP_PUBLISH_PROFILE_CONTAINER`: From Web App publish profile
- `AZURE_RESOURCE_GROUP`: `smartmuse`

### 5. Test Deployment
Push any change to trigger the GitHub Actions workflow, which will:
1. Build Docker image
2. Push to Azure Container Registry
3. Deploy to Azure Web App for Containers

## Alternative: Quick CLI Setup
If you prefer CLI (after fixing authentication):

```bash
# Create Container Registry
az acr create --resource-group smartmuse --name admuseeasyregistry --sku Basic --admin-enabled true

# Get registry credentials
az acr credential show --name admuseeasyregistry

# Configure web app
az webapp config container set --name Admuse-Easy --resource-group smartmuse --docker-custom-image-name admuseeasyregistry.azurecr.io/admuseasy:latest --docker-registry-server-url https://admuseeasyregistry.azurecr.io
```

## Next Steps
1. Complete the Azure Portal setup above
2. Add GitHub secrets
3. Push to main branch to test deployment
4. Monitor deployment in GitHub Actions and Azure Portal