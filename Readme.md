# JR Dev Case – DLL Integration with Python Backend

## Overview

This project demonstrates integration between a .NET DLL and a Python backend, exposed through a web interface using WebSockets.

The system includes:

* A C# Class Library (DLL) exposing utility methods
* A Python backend using **pythonnet** to call the DLL
* A WebSocket-based API
* A browser-based frontend
* A **Windows Service** to supervise the backend
* A **Launcher application** to manage browser behavior

---

## Final Architecture

```text
            ┌────────────────────┐
            │   Windows Service  │
            │   (WinSW)          │
            └─────────┬──────────┘
                      │
                      ▼
               server.exe (FastAPI)
                      │
                      │ pythonnet
                      ▼
                 CaseLib.dll
                      │
                      ▼
               WebSocket API
                      │
                      ▼
               Frontend (HTML/JS)

   + Separate User Process:
     launcher.exe → Opens browser and keeps it alive
```

---

## Key Design Decision (IMPORTANT)

Modern Windows services **cannot reliably launch interactive browser windows**.

To solve this:

* The **backend is managed by Windows Service**
* The **browser is managed by a separate launcher process**

This ensures:

* Backend always runs (even without user session)
* Browser automatically opens when user runs the system
* Browser reopens if user closes it

---

## Project Structure

```text
JR-DEV-CASE
│
├─ CaseLib/
│
├─ frontend/
│
├─ python-app/
│   └─ server.py
│
├─ service/
│   ├─ launcher.py
│   ├─ jr-dev-service.xml
│   ├─ start.bat
│   └─ stop.bat
│
├─ .gitignore
└─ README.md
```

---

## DLL Functionality

| Method             | Description                                 |
| ------------------ | ------------------------------------------- |
| GetMessage1        | Returns a predefined message                |
| GetMessage2        | Returns a predefined message                |
| GetMessage3        | Returns a predefined message                |
| GetSystemTime      | Returns current system time                 |
| ConvertBase64ToHex | Converts Base64 image data into hexadecimal |

---

## How to Run the System (IMPORTANT)

### Step 1 – Install the Service

```bash
cd service
jr-dev-service.exe install
```

---

### Step 2 – Start the System

```bash
start.bat
```

This will:

* Start the Windows Service (backend)
* Launch the browser via launcher.exe

---

### Step 3 – Use the App

Open in browser:

```text
http://127.0.0.1:8000
```

---

### Step 4 – Stop the System

```bash
stop.bat
```

---

## Browser Supervision

The launcher:

* Opens browser automatically
* Detects if browser is closed
* Reopens browser after cooldown

This fulfills the requirement:

> “If frontend is closed, it should be restarted”

---

## Backend Supervision (Service)

The Windows Service ensures:

* Backend starts automatically
* Backend restarts if it crashes
* Runs independently of user session

---

## Crash Recovery Test

1. Run `start.bat`
2. Open Task Manager
3. Kill `server.exe`

Expected:

* Service automatically restarts backend

---

## Technologies Used

* C# (.NET)
* Python
* FastAPI
* pythonnet
* WebSockets
* HTML / JavaScript
* PyInstaller
* WinSW

---

## Conclusion

This project demonstrates:

* Cross-language integration (.NET + Python)
* Real-time communication (WebSockets)
* Process supervision using Windows Services
* Separation of system-level and user-level responsibilities

The architecture ensures reliability, maintainability, and proper handling of Windows limitations.
