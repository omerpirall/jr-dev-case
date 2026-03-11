JR Dev Case – DLL, WebSocket, Service Integration
Overview

This project demonstrates integration between a .NET DLL, a Python backend, and a web frontend.
The system exposes DLL functionality through a WebSocket API, provides a simple browser UI, and runs as a Windows Service with automatic restart and recovery.

Key features:

C# class library exposing utility methods

Python backend loading the DLL using pythonnet

WebSocket API for real-time communication

Frontend interface interacting with backend

Image → Base64 → Hex conversion pipeline

Python application packaged as a standalone .exe

Windows Service supervision using WinSW

Automatic restart if backend crashes

Architecture
Frontend (HTML / JS)
        │
        │ WebSocket
        ▼
Python Backend (FastAPI + pythonnet)
        │
        │ CLR bridge
        ▼
C# DLL (CaseLib)
Components
Component	Technology
Frontend	HTML, JavaScript
Backend	Python, FastAPI
Interop	pythonnet
DLL	C# (.NET)
Packaging	PyInstaller
Service Supervision	WinSW
Project Structure
JR-DEV-CASE
│
├─ CaseLib
│   ├─ CaseLib.csproj
│   ├─ CaseLib.sln
│   └─ UtilityFunctions.cs
│
├─ frontend
│   ├─ index.html
│   ├─ app.js
│   └─ style.css
│
├─ python-app
│   ├─ CaseLib.dll
│   ├─ server.py
│   └─ dist
│       └─ server.exe
│
├─ service
│   ├─ jr-dev-service.exe
│   └─ jr-dev-service.xml
│
└─ README.md
DLL Functionality

The .NET library exposes the following methods:

Method	Description
GetMessage1	Returns a static message
GetMessage2	Returns a static message
GetMessage3	Returns a static message
GetSystemTime	Returns current system time
ConvertBase64ToHex	Converts Base64 image data to hexadecimal

These methods are loaded from Python via pythonnet.

Python Backend

The Python backend:

Loads the .NET DLL using pythonnet

Exposes a WebSocket endpoint

Serves the frontend UI

Handles image conversion requests

Example WebSocket endpoint:

ws://127.0.0.1:8000/ws

The backend returns responses based on the DLL method invoked.

Frontend

The frontend provides a simple interface allowing users to:

Call DLL methods via WebSocket

Retrieve system messages

Display server responses

Upload an image file

Convert the image to Base64

Send the Base64 data to the backend

Receive and display hexadecimal output

Packaging the Python Application

The Python backend is packaged as a standalone executable using PyInstaller.

Command used:

pyinstaller --onefile --add-data "CaseLib.dll;." server.py

Result:

python-app/dist/server.exe

This allows the backend to run on systems without requiring Python installation.

Windows Service

The packaged backend is supervised by WinSW (Windows Service Wrapper).

The service configuration file:

service/jr-dev-service.xml

Service responsibilities:

Start server.exe

Automatically restart if the process crashes

Run automatically on system startup

Install service:

jr-dev-service.exe install

Start service:

jr-dev-service.exe start

Stop service:

jr-dev-service.exe stop

Uninstall service:

jr-dev-service.exe uninstall
Crash Recovery

The service is configured with restart policies:

<onfailure action="restart" delay="5 sec"/>
<onfailure action="restart" delay="10 sec"/>
<onfailure action="restart" delay="20 sec"/>

If server.exe terminates unexpectedly, the service automatically restarts the backend.

This ensures continuous availability of the system.

Running the System

After the service starts, the application can be accessed via:

http://127.0.0.1:8000

The frontend UI connects to the backend WebSocket and interacts with the DLL.

Technologies Used

.NET (C#)

Python

FastAPI

pythonnet

WebSockets

HTML / JavaScript

PyInstaller

WinSW

Notes

The backend process is supervised by a Windows Service to ensure reliability.

Frontend communication uses WebSocket for real-time interaction.

The system demonstrates cross-language interoperability between .NET and Python.

Author

JR Dev Case Implementation