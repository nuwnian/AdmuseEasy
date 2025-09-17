# 🐳 Post-WSL Connection Setup

## **After connecting to WSL, run these commands:**

### **1. Install Docker Extension in WSL Environment**
```bash
# In the new WSL VS Code window:
code --install-extension ms-azuretools.vscode-docker
```

### **2. Open Your Project in WSL**
```bash
# Navigate to your project
cd /mnt/d/AdmuseEasy

# Open in VS Code
code .
```

### **3. Test Docker Integration**
- Open **Docker tab** in VS Code sidebar
- You should see your containers:
  - `admuseeasy-admuse-app-1`
  - `admuseeasy-mongodb-1`

### **4. Better Debugging**
```bash
# In WSL terminal:
docker logs admuseeasy-admuse-app-1 -f    # Follow logs
docker exec -it admuseeasy-admuse-app-1 bash    # Enter container
docker ps    # See containers
```

### **5. Test API from WSL**
```bash
curl http://localhost:5000/api/health
```

---

## **Benefits of WSL Connection:**
- ✅ **Native Docker integration**
- ✅ **Linux terminal commands** 
- ✅ **Better container debugging**
- ✅ **Direct file access** in Linux environment
- ✅ **No more `wsl` prefix** needed

## **Troubleshooting:**
If connection fails:
1. Ensure WSL2 is running: `wsl --status`
2. Restart WSL: `wsl --shutdown` then `wsl`
3. Check Ubuntu is installed: `wsl --list`