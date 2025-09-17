# Azure Container Registry Setup Guide

## Your Azure Details
- **Resource Group**: `Hackathon-AI`
- **Location**: `Indonesia Central`
- **Subscription**: `Azure for Students`
- **Web App**: `Admuse-Easy`

## Option 1: Azure Portal Setup (Recommended while provider registers)

### Step 1: Create Container Registry
1. Go to Azure Portal → "Create a resource"
2. Search for "Container Registry"
3. Click "Create"
4. Configure:
   - **Subscription**: Azure for Students
   - **Resource group**: `Hackathon-AI`
   - **Registry name**: `admuseeasyregistry` (or choose unique name)
   - **Location**: Indonesia Central
   - **SKU**: Basic
   - **Admin user**: Enable ✅

### Step 2: Configure Web App for Containers
In your Admuse-Easy Deployment Center:

1. **Source**: Azure Container Registry
2. **Subscription**: Azure for Students
3. **Registry**: Select `admuseeasyregistry`
4. **Image**: `admuseasy`
5. **Tag**: `latest`
6. **Startup Command**: (leave empty)

### Step 3: Get GitHub Secrets
After creating the registry:

1. **Container Registry Credentials**:
   - Go to Container Registry → Access keys
   - Copy:
     - **Login server** → `AZURE_REGISTRY_LOGIN_SERVER`
     - **Username** → `AZURE_REGISTRY_USERNAME`
     - **Password** → `AZURE_REGISTRY_PASSWORD`

2. **Web App Publish Profile**:
   - Go to Admuse-Easy → Overview
   - Click "Download publish profile"
   - Copy entire content → `AZURE_WEBAPP_PUBLISH_PROFILE_CONTAINER`

3. **Resource Group**:
   - Set `AZURE_RESOURCE_GROUP` = `Hackathon-AI`

### Step 4: Add GitHub Secrets
Go to https://github.com/nuwnian/AdmuseEasy/settings/secrets/actions

Add these 4 secrets:
- `AZURE_REGISTRY_LOGIN_SERVER`
- `AZURE_REGISTRY_USERNAME`
- `AZURE_REGISTRY_PASSWORD`
- `AZURE_WEBAPP_PUBLISH_PROFILE_CONTAINER`
- `AZURE_RESOURCE_GROUP`

## Option 2: CLI Setup (After provider registration completes)

```bash
# Check if provider is registered
az provider show -n Microsoft.ContainerRegistry --query "registrationState"

# Create container registry
az acr create --resource-group Hackathon-AI --name admuseeasyregistry --sku Basic --location indonesiacentral --admin-enabled true

# Get registry credentials
az acr credential show --name admuseeasyregistry

# Configure web app for containers
az webapp config container set --name Admuse-Easy --resource-group Hackathon-AI --docker-custom-image-name admuseeasyregistry.azurecr.io/admuseasy:latest --docker-registry-server-url https://admuseeasyregistry.azurecr.io
```

## What Happens Next
1. GitHub Actions will build your Docker image
2. Push it to Azure Container Registry
3. Deploy to your Web App for Containers
4. Your app will be accessible at: https://admuse-easy.azurewebsites.net

## Troubleshooting
- If registry name is taken, try: `admuseeasy2024`, `nuwnian-admuse`, etc.
- Make sure Admin user is enabled on the registry
- Wait for provider registration to complete before using CLI