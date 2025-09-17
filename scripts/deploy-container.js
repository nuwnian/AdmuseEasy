#!/usr/bin/env node

// Azure Container Deployment Helper Script

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 AdmuseEasy Azure Container Deployment Helper');
console.log('================================================');

// Configuration
const config = {
  resourceGroup: 'rg-admuse-easy',
  registryName: 'admuseregistry',
  webAppName: 'admuse-easy-container',
  imageName: 'admuse-easy',
  location: 'eastus'
};

// Helper function to run commands
const runCommand = (command, description) => {
  console.log(`\n📋 ${description}...`);
  console.log(`💻 Running: ${command}`);
  
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log('✅ Success!');
    if (output.trim()) {
      console.log(output);
    }
    return output;
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.stdout) console.log('Output:', error.stdout);
    if (error.stderr) console.log('Error output:', error.stderr);
    throw error;
  }
};

// Check if Azure CLI is installed and logged in
const checkAzureCLI = () => {
  console.log('\n🔍 Checking Azure CLI...');
  try {
    runCommand('az --version', 'Checking Azure CLI version');
    runCommand('az account show', 'Checking Azure login status');
    return true;
  } catch (error) {
    console.log('❌ Azure CLI not installed or not logged in');
    console.log('📖 Please install Azure CLI and run: az login');
    return false;
  }
};

// Create Azure resources
const createResources = () => {
  console.log('\n🏗️ Creating Azure Resources...');
  
  try {
    // Create resource group
    runCommand(
      `az group create --name ${config.resourceGroup} --location ${config.location}`,
      'Creating resource group'
    );

    // Create container registry
    runCommand(
      `az acr create --resource-group ${config.resourceGroup} --name ${config.registryName} --sku Basic --admin-enabled true`,
      'Creating Azure Container Registry'
    );

    // Create app service plan
    runCommand(
      `az appservice plan create --name plan-${config.webAppName} --resource-group ${config.resourceGroup} --sku B1 --is-linux`,
      'Creating App Service Plan'
    );

    // Create web app for containers
    runCommand(
      `az webapp create --resource-group ${config.resourceGroup} --plan plan-${config.webAppName} --name ${config.webAppName} --deployment-container-image-name ${config.registryName}.azurecr.io/${config.imageName}:latest`,
      'Creating Web App for Containers'
    );

    console.log('\n✅ All Azure resources created successfully!');
    
  } catch (error) {
    console.log('\n❌ Error creating resources:', error.message);
    throw error;
  }
};

// Get credentials
const getCredentials = () => {
  console.log('\n🔑 Getting credentials...');
  
  try {
    // Get ACR credentials
    const acrCreds = runCommand(
      `az acr credential show --name ${config.registryName}`,
      'Getting ACR credentials'
    );
    
    // Get publish profile
    const publishProfile = runCommand(
      `az webapp deployment list-publishing-profiles --name ${config.webAppName} --resource-group ${config.resourceGroup} --xml`,
      'Getting publish profile'
    );

    console.log('\n📋 Add these to your GitHub Secrets:');
    console.log('=====================================');
    
    const creds = JSON.parse(acrCreds);
    console.log(`AZURE_REGISTRY_USERNAME: ${config.registryName}`);
    console.log(`AZURE_REGISTRY_PASSWORD: ${creds.passwords[0].value}`);
    console.log(`AZURE_RESOURCE_GROUP: ${config.resourceGroup}`);
    console.log('\nAZURE_WEBAPP_PUBLISH_PROFILE_CONTAINER:');
    console.log('(Copy the XML output above)');
    
    // Save to file for convenience
    fs.writeFileSync('azure-secrets.txt', `
AZURE_REGISTRY_USERNAME=${config.registryName}
AZURE_REGISTRY_PASSWORD=${creds.passwords[0].value}
AZURE_RESOURCE_GROUP=${config.resourceGroup}

AZURE_WEBAPP_PUBLISH_PROFILE_CONTAINER:
${publishProfile}
    `);
    
    console.log('\n💾 Credentials saved to azure-secrets.txt');
    
  } catch (error) {
    console.log('\n❌ Error getting credentials:', error.message);
    throw error;
  }
};

// Configure web app settings
const configureWebApp = () => {
  console.log('\n⚙️ Configuring Web App settings...');
  
  try {
    // Set application settings
    runCommand(
      `az webapp config appsettings set --resource-group ${config.resourceGroup} --name ${config.webAppName} --settings NODE_ENV=production PORT=80 WEBSITES_PORT=5000`,
      'Setting basic app settings'
    );

    // Configure health check
    runCommand(
      `az webapp config set --resource-group ${config.resourceGroup} --name ${config.webAppName} --health-check-path "/api/health"`,
      'Configuring health check'
    );

    // Enable container logging
    runCommand(
      `az webapp log config --name ${config.webAppName} --resource-group ${config.resourceGroup} --docker-container-logging filesystem`,
      'Enabling container logging'
    );

    console.log('\n✅ Web App configured successfully!');
    
  } catch (error) {
    console.log('\n❌ Error configuring web app:', error.message);
    throw error;
  }
};

// Build and push container
const buildAndPush = () => {
  console.log('\n🐳 Building and pushing container...');
  
  try {
    // Login to ACR
    runCommand(
      `az acr login --name ${config.registryName}`,
      'Logging in to Azure Container Registry'
    );

    // Build and push image
    const imageTag = `${config.registryName}.azurecr.io/${config.imageName}:latest`;
    
    runCommand(
      `docker build -t ${imageTag} .`,
      'Building Docker image'
    );

    runCommand(
      `docker push ${imageTag}`,
      'Pushing image to ACR'
    );

    // Configure web app to use the image
    runCommand(
      `az webapp config container set --name ${config.webAppName} --resource-group ${config.resourceGroup} --docker-custom-image-name ${imageTag}`,
      'Configuring web app to use container image'
    );

    // Restart web app
    runCommand(
      `az webapp restart --name ${config.webAppName} --resource-group ${config.resourceGroup}`,
      'Restarting web app'
    );

    console.log('\n✅ Container built and deployed successfully!');
    console.log(`🌐 Your app will be available at: https://${config.webAppName}.azurewebsites.net`);
    
  } catch (error) {
    console.log('\n❌ Error building/pushing container:', error.message);
    throw error;
  }
};

// Test deployment
const testDeployment = () => {
  console.log('\n🧪 Testing deployment...');
  
  const appUrl = `https://${config.webAppName}.azurewebsites.net`;
  
  console.log('⏳ Waiting for deployment to be ready...');
  
  // Wait a bit for deployment
  setTimeout(() => {
    try {
      runCommand(
        `curl -f ${appUrl}/api/health`,
        'Testing health endpoint'
      );
      
      console.log('\n🎉 Deployment test successful!');
      console.log(`🌐 App URL: ${appUrl}`);
      console.log(`📊 Health check: ${appUrl}/api/health`);
      
    } catch (error) {
      console.log('\n⚠️ Health check failed - app might still be starting up');
      console.log(`🌐 Check manually: ${appUrl}`);
    }
  }, 30000); // Wait 30 seconds
};

// Main execution
const main = async () => {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    if (!checkAzureCLI()) {
      process.exit(1);
    }

    switch (command) {
      case 'create':
        createResources();
        getCredentials();
        configureWebApp();
        break;
        
      case 'deploy':
        buildAndPush();
        testDeployment();
        break;
        
      case 'test':
        testDeployment();
        break;
        
      case 'credentials':
        getCredentials();
        break;
        
      case 'logs':
        runCommand(
          `az webapp log tail --name ${config.webAppName} --resource-group ${config.resourceGroup}`,
          'Viewing application logs'
        );
        break;
        
      default:
        console.log('\n📖 Usage:');
        console.log('node deploy-container.js create     - Create all Azure resources');
        console.log('node deploy-container.js deploy     - Build and deploy container');
        console.log('node deploy-container.js test       - Test deployment');
        console.log('node deploy-container.js credentials - Get credentials for GitHub');
        console.log('node deploy-container.js logs       - View application logs');
        break;
    }
    
  } catch (error) {
    console.log('\n💥 Deployment failed:', error.message);
    process.exit(1);
  }
};

main();