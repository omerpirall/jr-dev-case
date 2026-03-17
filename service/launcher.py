import subprocess
import time
import os
import sys
import signal
import socket
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
BROWSER_PROFILE_DIR = BASE_DIR / "browser_profile"
PROFILE_MARKER = "browser_profile"

running = True
last_browser_launch_time = 0.0


def write_pid():
    PID_FILE.write_text(str(os.getpid()), encoding="utf-8")


def remove_pid():
    try:
        PID_FILE.unlink(missing_ok=True)
    except Exception:
        pass


def is_server_up(host="127.0.0.1", port=8000, timeout=1):
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except Exception:
        return False


def find_browser_exe():
    for path in EDGE_PATHS + CHROME_PATHS:
        if os.path.exists(path):
            return path
    return None


def browser_launch_allowed():
    return (time.time() - last_browser_launch_time) >= BROWSER_REOPEN_COOLDOWN


def build_browser_args(browser_exe: str):
    browser_name = os.path.basename(browser_exe).lower()
    profile_arg = f"--user-data-dir={BROWSER_PROFILE_DIR}"

    if "msedge.exe" in browser_name:
        return [
            browser_exe,
            "--inprivate",
            profile_arg,
            "--new-window",
            APP_URL,
        ]

    return [
        browser_exe,
        "--incognito",
        profile_arg,
        "--new-window",
        APP_URL,
    ]


def is_target_browser_running():
    """
    Sadece bizim launcher'ın açtığı browser instance'ını arar.
    Arama kriteri:
    - process adı msedge.exe veya chrome.exe
    - command line içinde browser_profile geçiyor
    """
    ps_script = rf"""
$marker = "{PROFILE_MARKER}"
$procs = Get-CimInstance Win32_Process | Where-Object {{
    ($_.Name -eq 'msedge.exe' -or $_.Name -eq 'chrome.exe') -and
    $_.CommandLine -ne $null -and
    $_.CommandLine -like "*$marker*"
}}
if ($procs.Count -gt 0) {{
    Write-Output "FOUND"
}} else {{
    Write-Output "NOT_FOUND"
}}
"""
    try:
        result = subprocess.run(
            [
                "powershell",
                "-NoProfile",
                "-ExecutionPolicy", "Bypass",
                "-Command", ps_script
            ],
            capture_output=True,
            text=True,
            timeout=5,
        )
        output = (result.stdout or "").strip()
        print(f"[DEBUG] browser detection output={output}")
        return output == "FOUND"
    except Exception as e:
        print(f"[ERROR] Browser detection failed: {e}")
        return False


def start_browser():
    global last_browser_launch_time

    if not browser_launch_allowed():
        remaining = BROWSER_REOPEN_COOLDOWN - (time.time() - last_browser_launch_time)
        print(f"[DEBUG] Cooldown active, {remaining:.1f}s remaining.")
        return False

    browser_exe = find_browser_exe()
    if not browser_exe:
        print("[ERROR] No supported browser found (Edge/Chrome).")
        return False

    BROWSER_PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    args = build_browser_args(browser_exe)

    try:
        print(f"[INFO] Opening browser: {args}")
        subprocess.Popen(args, cwd=str(BASE_DIR))
        last_browser_launch_time = time.time()
        return True
    except Exception as e:
        print(f"[ERROR] Failed to open browser: {e}")
        return False


def ensure_browser():
    server_up = is_server_up()
    browser_running = is_target_browser_running()

    print(f"[DEBUG] server_up={server_up}, browser_running={browser_running}")

    if not server_up:
        print(f"[INFO] Launcher monitoring {APP_URL}")
        return False

    if browser_running:
        return True

    print("[INFO] Browser closed. Reopening...")
    return start_browser()


def shutdown(signum=None, frame=None):
    global running
    if not running:
        return

    print("[INFO] Launcher shutting down...")
    running = False
    remove_pid()
    sys.exit(0)


def main():
    write_pid()

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)
    if hasattr(signal, "SIGBREAK"):
        signal.signal(signal.SIGBREAK, shutdown)

    print(f"[INFO] Launcher monitoring {APP_URL}")
    print(f"[INFO] BASE_DIR={BASE_DIR}")
    print(f"[INFO] BROWSER_PROFILE_DIR={BROWSER_PROFILE_DIR}")

    ensure_browser()

    while running:
        ensure_browser()
        time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    try:
        main()
    finally:
        remove_pid()