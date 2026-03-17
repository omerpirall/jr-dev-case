import subprocess
import time
import os
import sys
import signal
from pathlib import Path

APP_URL = "http://127.0.0.1:8000"
CHECK_INTERVAL = 5
BROWSER_REOPEN_COOLDOWN = 20  # saniye

EDGE_PATHS = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]

CHROME_PATHS = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
]

if getattr(sys, "frozen", False):
    BASE_DIR = Path(sys.executable).resolve().parent
else:
    BASE_DIR = Path(__file__).resolve().parent

PID_FILE = BASE_DIR / "launcher.pid"

browser_process = None
running = True
last_browser_launch_time = 0.0


def write_pid():
    PID_FILE.write_text(str(os.getpid()), encoding="utf-8")


def remove_pid():
    try:
        PID_FILE.unlink(missing_ok=True)
    except Exception:
        pass


def find_browser_exe():
    for path in EDGE_PATHS + CHROME_PATHS:
        if os.path.exists(path):
            return path
    return None


def browser_launch_allowed():
    global last_browser_launch_time
    return (time.time() - last_browser_launch_time) >= BROWSER_REOPEN_COOLDOWN


def start_browser():
    global browser_process, last_browser_launch_time

    if not browser_launch_allowed():
        return False

    browser_exe = find_browser_exe()
    if not browser_exe:
        print("[ERROR] No supported browser found (Edge/Chrome).")
        return False

    browser_name = os.path.basename(browser_exe).lower()

    if "msedge.exe" in browser_name:
        args = [
            browser_exe,
            "--inprivate",
            "--new-window",
            APP_URL,
        ]
    else:
        args = [
            browser_exe,
            "--incognito",
            "--new-window",
            APP_URL,
        ]

    try:
        print(f"[INFO] Opening browser: {args}")
        browser_process = subprocess.Popen(args, cwd=str(BASE_DIR))
        last_browser_launch_time = time.time()
        return True
    except Exception as e:
        print(f"[ERROR] Failed to open browser: {e}")
        browser_process = None
        return False


def ensure_browser():
    global browser_process

    if browser_process is None or browser_process.poll() is not None:
        if browser_process is not None and browser_process.poll() is not None:
            print("[WARN] Browser closed. Reopening...")
        return start_browser()

    return True


def stop_process(proc, name):
    if proc is None or proc.poll() is not None:
        return

    try:
        print(f"[INFO] Stopping {name} (pid={proc.pid})")
        proc.terminate()
        proc.wait(timeout=5)
    except Exception:
        try:
            proc.kill()
        except Exception:
            pass


def shutdown(signum=None, frame=None):
    global running

    if not running:
        return

    print("[INFO] Launcher shutting down...")
    running = False

    stop_process(browser_process, "browser")
    remove_pid()
    sys.exit(0)


def main():
    write_pid()

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)
    if hasattr(signal, "SIGBREAK"):
        signal.signal(signal.SIGBREAK, shutdown)

    print("[INFO] Browser launcher started")
    ensure_browser()

    while running:
        ensure_browser()
        time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    try:
        main()
    finally:
        remove_pid()