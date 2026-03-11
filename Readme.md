JR Dev Case – DLL Integration with Python Backend
Overview

This project demonstrates how a .NET DLL can be integrated with a Python backend and accessed through a web interface using WebSockets.

The system includes:

A C# Class Library (DLL) exposing utility methods

A Python backend that loads the DLL using pythonnet

A WebSocket API to communicate with the frontend

A simple web UI to trigger DLL functions

Image conversion functionality (Base64 → Hex)

A Windows Service that supervises the backend process and restarts it if it crashes

Architecture

The system architecture is shown below:

Frontend (HTML / JS)
        │
        │ WebSocket
        ▼
Python Backend (FastAPI)
        │
        │ pythonnet
        ▼
C# DLL (CaseLib)


The frontend communicates with the backend via WebSockets, and the backend executes DLL methods.

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
│   ├─ server.py
│   ├─ CaseLib.dll
│   └─ dist
│       └─ server.exe
│
├─ service
│   ├─ jr-dev-service.exe
│   └─ jr-dev-service.xml
│
└─ README.md

DLL Functionality

The .NET DLL provides the following methods:

Method	Description
GetMessage1	Returns a predefined message
GetMessage2	Returns a predefined message
GetMessage3	Returns a predefined message
GetSystemTime	Returns current system time
ConvertBase64ToHex	Converts Base64 image data into hexadecimal

These methods are accessed from Python using pythonnet.

Running the Backend

Navigate to the backend executable folder:

cd python-app/dist


Run the packaged backend:

server.exe


If successful, the terminal should display:

Uvicorn running on http://127.0.0.1:8000

Accessing the Frontend

Open a browser and navigate to:

http://127.0.0.1:8000


The web interface should load and allow interaction with the backend.

Testing the System
1. Test DLL Messages

Click the buttons:

Get Message 1

Get Message 2

Get Message 3

Get System Time

Expected result:

The frontend should display responses returned from the DLL.

This confirms that the Python backend successfully loads and calls the DLL methods.

2. Test Image Conversion

Upload an image using the file input

The frontend converts the image to Base64

The backend sends the Base64 data to the DLL

The DLL converts it to hexadecimal

The hexadecimal result is returned and displayed

This confirms the full pipeline:

Frontend → WebSocket → Python → DLL → Python → Frontend

Windows Service Integration

The backend executable is supervised using WinSW (Windows Service Wrapper).

This ensures that:

The backend starts automatically

The process restarts if it crashes

The service runs independently of user sessions

Install the service:

cd service
jr-dev-service.exe install


Start the service:

jr-dev-service.exe start


Stop the service:

jr-dev-service.exe stop


Uninstall the service:

jr-dev-service.exe uninstall

Crash Recovery Test

To verify the service restart mechanism:

Start the service

Open Task Manager

Locate server.exe

End the process manually

Expected behavior:

Within a few seconds, the service automatically restarts server.exe.

This confirms that WinSW supervision is functioning correctly.

Technologies Used

C# (.NET)

Python

FastAPI

pythonnet

WebSockets

HTML / JavaScript

PyInstaller

WinSW

Design Decisions

pythonnet was used to bridge Python and the .NET DLL.

FastAPI was chosen for simplicity and WebSocket support.

WebSockets allow real-time communication between frontend and backend.

WinSW was used to supervise the backend process and automatically restart it if it crashes.

Conclusion

This project demonstrates a simple but complete pipeline integrating:

.NET DLL functionality

Python backend processing

WebSocket communication

Browser-based frontend

Windows service supervision

The system shows how cross-language integration can be implemented and managed reliably.