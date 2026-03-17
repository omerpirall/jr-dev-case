from pythonnet import load
load("coreclr")

import clr
import System  # type: ignore
import json
import uvicorn
import os
import sys
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

if getattr(sys, "frozen", False):
    BASE_DIR = Path(sys.executable).resolve().parent
else:
    BASE_DIR = Path(__file__).resolve().parent

frontend_path = BASE_DIR / "frontend"
dll_path = BASE_DIR / "CaseLib.dll"

print("frontend_path =", frontend_path)
print("dll_path =", dll_path)

clr.AddReference(str(dll_path))
assembly = System.Reflection.Assembly.LoadFile(str(dll_path))
utility_type = assembly.GetType("CaseLib.UtilityFunctions")

if utility_type is None:
    raise Exception("CaseLib.UtilityFunctions type bulunamadı.")


def call_method(method_name, args=None):
    method = utility_type.GetMethod(method_name)
    if method is None:
        return f"Method not found: {method_name}"

    if args is None:
        return str(method.Invoke(None, None))
    return str(method.Invoke(None, args))


app.mount("/static", StaticFiles(directory=str(frontend_path)), name="static")


@app.get("/")
async def serve_index():
    return FileResponse(str(frontend_path / "index.html"))


@app.get("/app.js")
async def serve_js():
    return FileResponse(str(frontend_path / "app.js"))


@app.get("/style.css")
async def serve_css():
    return FileResponse(str(frontend_path / "style.css"))


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_text()

            try:
                payload = json.loads(data)
                action = payload.get("action")
            except Exception:
                payload = None
                action = data

            if action == "message1":
                result = call_method("GetMessage1")
            elif action == "message2":
                result = call_method("GetMessage2")
            elif action == "message3":
                result = call_method("GetMessage3")
            elif action == "time":
                result = call_method("GetSystemTime")
            elif action == "imageToHex":
                base64_data = payload.get("data", "") if payload else ""
                result = call_method("ConvertBase64ToHex", [base64_data])
            else:
                result = f"Unknown request: {action}"

            await websocket.send_text(result)

    except WebSocketDisconnect:
        print("Client disconnected normally.")

    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        try:
            await websocket.send_text(f"Error: {str(e)}")
        except Exception:
            pass


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)