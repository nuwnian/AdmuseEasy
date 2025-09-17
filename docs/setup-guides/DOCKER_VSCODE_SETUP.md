# 🐳 VS Code Docker Extension Setup for WSL2

## **Issue**: VS Code Docker Extension Can't Connect

The Docker extension is looking for Docker Desktop but you have Docker Engine in WSL2.

## **Solutions** (Choose One):

### **🎯 Solution 1: Configure Extension for WSL2 (Recommended)**

1. **Open VS Code Settings** (`Ctrl + ,`)
2. **Search for**: `docker host`
3. **Set Docker Host**: `tcp://localhost:2375`

**OR modify settings.json:**
```json
{
    "docker.host": "tcp://localhost:2375"
}
```

### **🎯 Solution 2: Use WSL2 Extension Instead**

1. **Install**: "Remote - WSL" extension
2. **Connect to WSL**: `Ctrl + Shift + P` → "WSL: Connect to WSL"
3. **Install Docker extension inside WSL**: Extensions will work natively

### **🎯 Solution 3: Enable Docker TCP (If needed)**

If Solution 1 doesn't work, enable Docker TCP in WSL2:

```bash
# In WSL2 terminal:
sudo dockerd -H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock &
```

### **🎯 Solution 4: Docker Context (Advanced)**

```bash
# In PowerShell:
wsl docker context create vscode-wsl --docker "host=unix:///var/run/docker.sock"
wsl docker context use vscode-wsl
```

## **🔍 Quick Test**

After configuration, test in VS Code:
- Open Command Palette (`Ctrl + Shift + P`)
- Run: `Docker: Show Logs`
- Should see your containers

## **✅ Expected Result**

- VS Code Docker tab shows your containers
- Can manage containers from VS Code
- Integration with development workflow

---

**Current Status**: Docker Engine working in WSL2 ✅  
**Next Step**: Configure VS Code extension connection