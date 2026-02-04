Step 2️⃣: Build the Kernel backend

Open PowerShell and navigate to the NeuroEdge kernel command folder:

cd C:\Users\user\OneDrive\Desktop\NeuroEdge-main\NeuroEdge-main\kernel\cmd\neuroedge


Build the executable using Go:

go build -o neuroedge.exe


If successful, you should now see neuroedge.exe in that folder.

This is the Kernel backend service that Orchestrator will communicate with.

✅ Check: Run dir in PowerShell. You should see:

neuroedge.exe
main.go
other .go files...

Step 3️⃣: Run the Kernel backend

In the same folder, run:

.\neuroedge.exe


You should see logs like:

🚀 NeuroEdge Kernel v1.0
[INFO] Listening on :8080


This means the Kernel backend is live and waiting for requests from the Orchestrator.

Step 4️⃣: Connect Orchestrator to Kernel

Open the Orchestrator config (likely orchestrator/src/config/config.json) and ensure it points to the kernel URL:

{
  "kernelUrl": "http://localhost:8080",
  "mlUrl": "http://localhost:7072",
  "port": 7070,
  "logLevel": "info"
}


Restart the Orchestrator:

cd ..\orchestrator
npm run dev


This time, KernelBridge should successfully connect.

You should see logs like:

[INFO] [KERNEL_BRIDGE] ✅ Connected to kernel
