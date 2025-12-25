
export const pythonSourceCode = `import sys
import os
import time
import subprocess
import re
import shutil
import sqlite3
import json
import urllib.request
import urllib.error
import threading

# GUI Imports
try:
    from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                                 QHBoxLayout, QLabel, QPushButton, QLineEdit, 
                                 QTextEdit, QTabWidget, QGroupBox, QProgressBar, 
                                 QFrame, QSplitter, QGridLayout, QMessageBox,
                                 QSizePolicy, QSpacerItem)
    from PyQt6.QtCore import Qt, QThread, pyqtSignal, QObject, QTimer, QSize
    from PyQt6.QtGui import QCursor, QIcon, QFont, QPalette, QColor
except ImportError:
    print("CRITICAL ERROR: PyQt6 is not installed.")
    print("Please run: pip install PyQt6 pymobiledevice3 requests")
    sys.exit(1)

# --- Configuration ---
APP_NAME = "Xtr1a Activator"
VERSION = "v1.1.0"
SERVER_URL = "https://aaronkotlin.pythonanywhere.com"

# --- EMBEDDED VIP ECID ---
EMBEDDED_ECID = "5F40BC428A8"

# --- Modern Cyber-Clean Stylesheet ---
STYLESHEET = """
QMainWindow {
    background-color: #050505;
}
QWidget {
    font-family: 'Segoe UI', 'Inter', sans-serif;
    font-size: 13px;
    color: #e2e8f0;
}

/* --- Frames & Containers --- */
QFrame#SidePanel {
    background-color: #0a0a0a;
    border-right: 1px solid #262626;
}
QFrame#Card {
    background-color: #0f0f10;
    border: 1px solid #27272a;
    border-radius: 12px;
}
QFrame#Header {
    background-color: rgba(10, 10, 10, 0.8);
    border-bottom: 1px solid #262626;
}

/* --- Typography --- */
QLabel#HeaderTitle {
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.5px;
}
QLabel#VersionTag {
    color: #06b6d4;
    background-color: rgba(6, 182, 212, 0.1);
    border: 1px solid rgba(6, 182, 212, 0.2);
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: 700;
}
QLabel#SectionTitle {
    font-size: 11px;
    font-weight: 700;
    color: #06b6d4; 
    text-transform: uppercase;
    letter-spacing: 1.2px;
    margin-bottom: 6px;
}
QLabel#DetailLabel {
    color: #71717a; 
    font-size: 11px; 
    font-weight: 600;
    text-transform: uppercase;
}
QLabel#DetailValue {
    color: #f4f4f5; 
    font-family: 'Consolas', monospace; 
    font-size: 13px;
    font-weight: 500;
}

/* --- Inputs --- */
QLineEdit {
    background-color: #18181b;
    border: 1px solid #27272a;
    border-radius: 6px;
    padding: 8px 12px;
    color: #ffffff;
    font-family: 'Consolas', monospace;
    font-size: 13px;
}
QLineEdit:focus {
    border: 1px solid #06b6d4;
    background-color: #27272a;
}
QLineEdit:disabled {
    color: #52525b;
    background-color: #09090b;
}

/* --- Buttons --- */
QPushButton {
    background-color: #18181b;
    border: 1px solid #27272a;
    border-radius: 6px;
    padding: 10px 16px;
    color: #e4e4e7;
    font-weight: 600;
    font-size: 12px;
}
QPushButton:hover {
    background-color: #27272a;
    border-color: #52525b;
}
QPushButton:pressed {
    background-color: #09090b;
}

QPushButton#PrimaryButton {
    background-color: #0891b2;
    border: 1px solid #0e7490;
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    padding: 12px;
}
QPushButton#PrimaryButton:hover {
    background-color: #06b6d4;
    border-color: #22d3ee;
}
QPushButton#PrimaryButton:disabled {
    background-color: #1e293b;
    border-color: #334155;
    color: #475569;
}

QPushButton#NavButton {
    text-align: left;
    padding-left: 20px;
    border: 0;
    background: transparent;
    color: #a1a1aa;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
}
QPushButton#NavButton:checked {
    color: #ffffff;
    font-weight: 600;
    background: #18181b;
    border: 1px solid #27272a;
}
QPushButton#NavButton:hover:!checked {
    color: #ffffff;
    background: #09090b;
}

QPushButton#SmallBtn {
    padding: 4px 8px;
    font-size: 10px;
    background-color: #27272a;
    border: none;
}
QPushButton#SmallBtn:hover {
    background-color: #3f3f46;
}

/* --- Others --- */
QTextEdit {
    background-color: #09090b;
    border: 1px solid #27272a;
    border-radius: 8px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 11px;
    padding: 12px;
    line-height: 1.4;
    color: #d4d4d8;
}

QProgressBar {
    background-color: #18181b;
    border: 1px solid #27272a;
    border-radius: 4px;
    text-align: center;
    color: transparent;
    height: 6px;
}
QProgressBar::chunk {
    background-color: #06b6d4;
    border-radius: 3px;
}

QSplitter::handle {
    background-color: #18181b;
    height: 1px;
}
QSplitter::handle:hover {
    background-color: #06b6d4;
}

QScrollBar:vertical {
    border: none;
    background: #09090b;
    width: 8px;
    margin: 0px;
}
QScrollBar::handle:vertical {
    background: #27272a;
    min-height: 20px;
    border-radius: 4px;
}
QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {
    height: 0px;
}
"""

# --- Worker Classes ---

class ConsoleSignal(QObject):
    text_written = pyqtSignal(str, str)
    progress_update = pyqtSignal(int)

class DeviceWorker(QThread):
    info_ready = pyqtSignal(dict)
    error_occurred = pyqtSignal(str)

    def run(self):
        # NO SIMULATION - REAL HARDWARE CHECK
        pmd3 = shutil.which("pymobiledevice3")
        commands = []
        if pmd3:
            commands.append([pmd3, "lockdown", "info"])
        commands.append([sys.executable, "-m", "pymobiledevice3", "lockdown", "info"])
        
        success = False
        last_error = ""

        for cmd in commands:
            try:
                flags = subprocess.CREATE_NO_WINDOW if sys.platform == 'win32' else 0
                res = subprocess.run(cmd, capture_output=True, text=True, creationflags=flags)
                
                if res.returncode == 0 and res.stdout:
                    try:
                        data = json.loads(res.stdout)
                        self.process_data(data)
                        success = True
                        break
                    except json.JSONDecodeError:
                        self.parse_text(res.stdout)
                        success = True
                        break
                else:
                    last_error = res.stderr.strip()
            except Exception as e:
                last_error = str(e)
        
        if not success:
            self.error_occurred.emit(f"Hardware Detection Failed: {last_error or 'Unknown Error'}")

    def process_data(self, info):
        ecid_raw = info.get("UniqueChipID", info.get("ECID", 0))
        ecid_hex = hex(ecid_raw).upper().replace("0X", "") if isinstance(ecid_raw, int) else str(ecid_raw)

        clean = {
            "ModelName": info.get("DeviceName", "Unknown Device"),
            "ModelID": info.get("ProductType", "Unknown"),
            "Serial": info.get("SerialNumber", "N/A"),
            "UDID": info.get("UniqueDeviceID", ""),
            "iOS": info.get("ProductVersion", "Unknown"),
            "IMEI": info.get("InternationalMobileEquipmentIdentity", "N/A"),
            "ECID": ecid_hex,
            "Activation": info.get("ActivationState", "Unknown"),
            "Capacity": info.get("DeviceCapacity", "N/A")
        }
        
        if isinstance(clean["Capacity"], int):
            clean["Capacity"] = f"{clean['Capacity'] // 1073741824} GB"

        if not clean["UDID"]:
            self.error_occurred.emit("Device detected but restricted. Trust Computer on device.")
        else:
            self.info_ready.emit(clean)

    def parse_text(self, output):
        info = {}
        for line in output.splitlines():
            if ": " in line:
                k, v = line.split(": ", 1)
                info[k.strip()] = v.strip()
                
        if "UniqueChipID" in info:
            try:
                info["UniqueChipID"] = int(info["UniqueChipID"])
            except:
                pass
        self.process_data(info)

class BypassWorker(QThread):
    finished = pyqtSignal(bool, str)
    
    def __init__(self, console_signal, device_info, use_auto_guid, manual_guid):
        super().__init__()
        self.console = console_signal
        self.dev = device_info
        self.base_url = SERVER_URL
        self.auto_guid = use_auto_guid
        self.man_guid = manual_guid

    def log(self, msg, color="#a1a1aa"):
        self.console.text_written.emit(msg, color)
    
    def progress(self, val):
        self.console.progress_update.emit(val)

    def run_cmd(self, cmd, timeout=None):
        try:
            flags = subprocess.CREATE_NO_WINDOW if sys.platform == 'win32' else 0
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, creationflags=flags)
            return res.returncode, res.stdout.strip(), res.stderr.strip()
        except subprocess.TimeoutExpired:
            return 124, "", "Timed out"
        except Exception as e:
            return 1, "", str(e)

    def check_registration(self):
        ecid = str(self.dev.get("ECID")).upper()
        self.log(f"Verifying ECID {ecid}...", "#d4d4d8")
        self.progress(10)
        
        # --- VIP BYPASS CHECK ---
        if ecid == EMBEDDED_ECID:
             self.log(f"VIP DEVICE DETECTED ({ecid})", "#f472b6")
             self.log("Server verification bypassed. Authorization Granted.", "#4ade80")
             return True
        # ------------------------

        url = f"{self.base_url}/check_ecid?ecid={ecid}"
        
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=8) as r:
                data = r.read().decode('utf-8').strip()
                if "REGISTERED" in data.upper() and "UNREGISTERED" not in data.upper():
                    self.log("Registration Verified: AUTHORIZED", "#4ade80")
                    return True
                else:
                    self.log(f"Server Validation Failed.", "#ef4444")
                    self.log("Please register ECID on the website first.", "#fbbf24")
                    return False
        except Exception as e:
            self.log(f"Connection failed: {e}", "#ef4444")
            return False

    def run(self):
        self.progress(5)
        self.log(f"--- Starting Bypass Process {VERSION} ---", "#22d3ee")
        
        if not self.check_registration():
            self.finished.emit(False, "Registration Failed")
            self.progress(0)
            return
        
        self.progress(20)
        max_retries = 6
        guid = None

        if self.auto_guid:
            for attempt in range(1, max_retries + 1):
                self.log(f"Attempt {attempt}/{max_retries}: Scanning for Activation GUID...", "#fbbf24")
                
                guid = self.detect_guid_once()
                
                if guid:
                    break
                
                if attempt < max_retries:
                    self.log(f"GUID not found. Rebooting device...", "#ef4444")
                    self.perform_reboot()
                    self.wait_for_device() 
                else:
                    self.log("Max retries reached. Could not find GUID.", "#ef4444")
                    self.finished.emit(False, "Failed to find GUID")
                    return
        else:
            guid = self.man_guid
            self.log(f"Using Manual GUID: {guid}", "#38bdf8")

        if not guid:
            self.finished.emit(False, "No GUID available")
            return
            
        self.log(f"GUID Acquired: {guid}", "#4ade80")
        self.progress(50)
        
        self.log("Requesting payload URLs...", "#d4d4d8")
        s1, s2, s3 = self.get_urls(guid)
        
        if not s3:
            self.log("Failed to get payload URLs.", "#ef4444")
            self.finished.emit(False, "Server Error / No Links")
            return
            
        self.log("Downloading Stage 3 Payload...", "#d4d4d8")
        self.progress(70)
        if self.download_and_push(s3):
            self.progress(100)
            self.log("✅ Payload Successfully Deployed!", "#4ade80")
            self.log("FINAL STEPS:", "#fbbf24")
            self.log("1. Device will reboot automatically", "#e4e4e7")
            self.log("2. Copy /iTunes_Control/iTunes/iTunesMetadata.plist to /Books/", "#e4e4e7")
            self.finished.emit(True, "Deployment Complete")
        else:
            self.progress(0)
            self.finished.emit(False, "Deployment Failed")

    def perform_reboot(self):
        try:
            flags = subprocess.CREATE_NO_WINDOW if sys.platform == 'win32' else 0
            subprocess.Popen([sys.executable, "-m", "pymobiledevice3", "diagnostics", "restart"], creationflags=flags)
            self.log("Reboot signal sent.", "#d4d4d8")
        except:
            self.log("Reboot command failed.", "#ef4444")

    def wait_for_device(self):
        self.log("Waiting for device reconnect (max 60s)...", "#d4d4d8")
        for i in range(60):
            time.sleep(1)
            cmd = [sys.executable, "-m", "pymobiledevice3", "lockdown", "info"]
            try:
                flags = subprocess.CREATE_NO_WINDOW if sys.platform == 'win32' else 0
                r = subprocess.run(cmd, capture_output=True, creationflags=flags)
                if r.returncode == 0:
                    self.log("Device Reconnected! Resuming scan...", "#4ade80")
                    time.sleep(4)
                    return
            except:
                pass

    def detect_guid_once(self):
        udid = self.dev.get("UDID")
        log_file = f"search_{udid}.logarchive"
        if os.path.exists(log_file): shutil.rmtree(log_file)
        cmd = [sys.executable, "-m", "pymobiledevice3", "syslog", "collect", log_file]
        self.log("Collecting logs (45s)...", "#d4d4d8")
        self.run_cmd(cmd, timeout=45) 
        trace = os.path.join(log_file, "logdata.LiveData.tracev3")
        if not os.path.exists(trace):
            return None
        try:
            with open(trace, 'rb') as f:
                content = f.read()
            pattern = re.compile(rb'[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}', re.IGNORECASE)
            matches = pattern.findall(content)
            from collections import Counter
            valid = [m.decode('ascii').upper() for m in matches if len(m.replace(b'0', b'').replace(b'-', b'')) > 5]
            if not valid: return None
            return Counter(valid).most_common(1)[0][0]
        except:
            return None
        finally:
            if os.path.exists(log_file): shutil.rmtree(log_file)

    def get_urls(self, guid):
        sn = self.dev.get("Serial")
        prd = self.dev.get("ModelID")
        ecid = str(self.dev.get("ECID")).upper()
        url = f"{self.base_url}/get_payload?prd={prd}&guid={guid}&sn={sn}"
        
        # Default Fallback Link
        fallback_link = "https://github.com/rhcp011235/A12_Bypass_OSS/raw/main/payload.db"

        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as r:
                out = r.read().decode('utf-8')
                js = json.loads(out)
                if js.get('success'):
                    l = js['links']
                    return l.get('step1_fixedfile'), l.get('step2_bldatabase'), l.get('step3_final')
        except Exception as e:
            self.log(f"Server Error: {e}", "#ef4444")
        
        # IF SERVER FAILS OR IS BLOCKED -> CHECK VIP
        if ecid == EMBEDDED_ECID:
             self.log("Using VIP Embedded Resources...", "#f472b6")
             return fallback_link, fallback_link, fallback_link
             
        return None, None, None

    def download_and_push(self, url):
        local = "payload.db"
        if os.path.exists(local): os.remove(local)
        self.run_cmd(["curl", "-L", "-o", local, url])
        target = "/Downloads/downloads.28.sqlitedb"
        self.log(f"Pushing to {target}...", "#d4d4d8")
        self.run_cmd([sys.executable, "-m", "pymobiledevice3", "afc", "rm", target])
        c, _, _ = self.run_cmd([sys.executable, "-m", "pymobiledevice3", "afc", "push", local, target])
        return c == 0

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle(f"{APP_NAME} {VERSION}")
        self.resize(1100, 750)
        self.device_info = {}
        self.console_signal = ConsoleSignal()
        self.console_signal.text_written.connect(self.log_msg)
        self.console_signal.progress_update.connect(self.update_progress)
        self.init_ui()

    def init_ui(self):
        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        main_layout = QHBoxLayout(main_widget)
        main_layout.setContentsMargins(0,0,0,0)
        main_layout.setSpacing(0)
        
        # --- SIDE PANEL ---
        side_panel = QFrame()
        side_panel.setObjectName("SidePanel")
        side_panel.setFixedWidth(240)
        sp_layout = QVBoxLayout(side_panel)
        sp_layout.setContentsMargins(20, 40, 20, 20)
        
        # Logo Area
        logo_lbl = QLabel(APP_NAME.split(' ')[0])
        logo_lbl.setObjectName("HeaderTitle")
        sp_layout.addWidget(logo_lbl)
        
        ver_lbl = QLabel(VERSION)
        ver_lbl.setObjectName("VersionTag")
        ver_lbl.setFixedSize(60, 20)
        ver_lbl.setAlignment(Qt.AlignmentFlag.AlignCenter)
        sp_layout.addWidget(ver_lbl)
        sp_layout.addSpacing(40)
        
        # Navigation
        self.nav_btns = []
        icons = ["⚡", "📘"]
        labels = ["Dashboard", "Guide & Info"]
        
        for i, text in enumerate(labels):
            btn = QPushButton(f"{icons[i]}   {text}")
            btn.setObjectName("NavButton")
            btn.setCheckable(True)
            btn.setFixedHeight(44)
            btn.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))
            btn.clicked.connect(lambda c, idx=i: self.change_tab(idx))
            sp_layout.addWidget(btn)
            sp_layout.addSpacing(4)
            self.nav_btns.append(btn)
            
        sp_layout.addStretch()
        
        # Footer
        footer = QLabel("© 2025 Xtr1a")
        footer.setStyleSheet("color: #52525b; font-size: 11px;")
        sp_layout.addWidget(footer)
        
        main_layout.addWidget(side_panel)
        
        # --- CONTENT AREA ---
        content_area = QWidget()
        ca_layout = QVBoxLayout(content_area)
        ca_layout.setContentsMargins(0,0,0,0)
        
        # Header
        header = QFrame()
        header.setObjectName("Header")
        header.setFixedHeight(60)
        h_layout = QHBoxLayout(header)
        h_layout.setContentsMargins(30, 0, 30, 0)
        self.header_title = QLabel("DASHBOARD")
        self.header_title.setStyleSheet("font-size: 16px; font-weight: 700; color: #ffffff; letter-spacing: 1px;")
        h_layout.addWidget(self.header_title)
        ca_layout.addWidget(header)
        
        # Tab Pages
        self.tabs = QTabWidget()
        self.tabs.tabBar().hide()
        
        self.page_dash = QWidget()
        self.page_guide = QWidget()
        
        self.tabs.addTab(self.page_dash, "")
        self.tabs.addTab(self.page_guide, "")
        
        ca_layout.addWidget(self.tabs)
        main_layout.addWidget(content_area)
        
        self.build_dashboard()
        self.build_guide_page()
        
        self.nav_btns[0].click()

    def change_tab(self, index):
        for i, btn in enumerate(self.nav_btns):
            btn.setChecked(i == index)
        self.tabs.setCurrentIndex(index)
        self.header_title.setText(self.nav_btns[index].text().split("   ")[1].upper())

    def build_dashboard(self):
        # Use a splitter for resizable panels
        splitter = QSplitter(Qt.Orientation.Horizontal)
        splitter.setHandleWidth(1)
        
        # -- LEFT: Device & Action --
        left_widget = QWidget()
        left_layout = QVBoxLayout(left_widget)
        left_layout.setContentsMargins(30, 30, 15, 30)
        left_layout.setSpacing(20)
        
        # Status Card
        status_card = QFrame()
        status_card.setObjectName("Card")
        status_layout = QHBoxLayout(status_card)
        status_layout.setContentsMargins(20, 20, 20, 20)
        
        self.status_dot = QLabel("●")
        self.status_dot.setStyleSheet("color: #71717a; font-size: 18px;")
        self.status_lbl = QLabel("DISCONNECTED")
        self.status_lbl.setStyleSheet("color: #71717a; font-weight: 700; font-size: 14px; margin-left: 5px;")
        
        btn_check = QPushButton("Check Device")
        btn_check.setObjectName("PrimaryButton")
        btn_check.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))
        btn_check.setFixedWidth(120)
        btn_check.clicked.connect(self.check_device)
        
        status_layout.addWidget(self.status_dot)
        status_layout.addWidget(self.status_lbl)
        status_layout.addStretch()
        status_layout.addWidget(btn_check)
        left_layout.addWidget(status_card)
        
        # Device Info Card
        dev_card = QFrame()
        dev_card.setObjectName("Card")
        dev_layout = QVBoxLayout(dev_card)
        dev_layout.setContentsMargins(24, 24, 24, 24)
        
        lbl_info = QLabel("DEVICE IDENTITY")
        lbl_info.setObjectName("SectionTitle")
        dev_layout.addWidget(lbl_info)
        dev_layout.addSpacing(10)
        
        grid = QGridLayout()
        grid.setVerticalSpacing(16)
        grid.setHorizontalSpacing(20)
        
        def mk_row(r, label, obj_name):
            l = QLabel(label)
            l.setObjectName("DetailLabel")
            v = QLabel("-")
            v.setObjectName("DetailValue")
            grid.addWidget(l, r, 0)
            grid.addWidget(v, r, 1)
            setattr(self, obj_name, v)
            
        mk_row(0, "MODEL NAME", "val_model")
        mk_row(1, "MODEL IDENTIFIER", "val_modelid")
        mk_row(2, "IOS VERSION", "val_ios")
        mk_row(3, "SERIAL NUMBER", "val_serial")
        mk_row(4, "IMEI", "val_imei")
        mk_row(5, "ACTIVATION", "val_act")
        
        dev_layout.addLayout(grid)
        dev_layout.addSpacing(16)
        
        # ECID Section
        ecid_lbl = QLabel("ECID (UNIQUE CHIP ID)")
        ecid_lbl.setObjectName("DetailLabel")
        dev_layout.addWidget(ecid_lbl)
        
        ecid_box = QHBoxLayout()
        self.val_ecid = QLineEdit()
        self.val_ecid.setReadOnly(True)
        self.val_ecid.setPlaceholderText("-")
        btn_copy = QPushButton("COPY")
        btn_copy.setObjectName("SmallBtn")
        btn_copy.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))
        btn_copy.clicked.connect(self.copy_ecid)
        ecid_box.addWidget(self.val_ecid)
        ecid_box.addWidget(btn_copy)
        dev_layout.addLayout(ecid_box)
        
        left_layout.addWidget(dev_card)
        left_layout.addStretch()
        
        # Action Area
        self.pbar = QProgressBar()
        self.pbar.setValue(0)
        left_layout.addWidget(self.pbar)
        
        self.btn_bypass = QPushButton("INITIATE BYPASS")
        self.btn_bypass.setObjectName("PrimaryButton")
        self.btn_bypass.setFixedHeight(50)
        self.btn_bypass.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))
        self.btn_bypass.clicked.connect(self.start_bypass)
        left_layout.addWidget(self.btn_bypass)

        # -- RIGHT: Console --
        right_widget = QWidget()
        right_layout = QVBoxLayout(right_widget)
        right_layout.setContentsMargins(15, 30, 30, 30)
        
        lbl_con = QLabel("SYSTEM LOG")
        lbl_con.setObjectName("SectionTitle")
        
        self.console = QTextEdit()
        self.console.setReadOnly(True)
        
        right_layout.addWidget(lbl_con)
        right_layout.addWidget(self.console)
        
        splitter.addWidget(left_widget)
        splitter.addWidget(right_widget)
        splitter.setStretchFactor(0, 4)
        splitter.setStretchFactor(1, 6)
        
        layout = QVBoxLayout(self.page_dash)
        layout.setContentsMargins(0,0,0,0)
        layout.addWidget(splitter)

    def build_guide_page(self):
        layout = QVBoxLayout(self.page_guide)
        layout.setContentsMargins(40, 40, 40, 40)
        card = QFrame()
        card.setObjectName("Card")
        l = QVBoxLayout(card)
        l.setContentsMargins(30, 30, 30, 30)
        
        txt = QTextEdit()
        txt.setReadOnly(True)
        txt.setStyleSheet("border: none; background: transparent; font-size: 14px;")
        txt.setHtml("""
        <h3 style='color: #fff;'>Instructions</h3>
        <p style='color: #a1a1aa;'>1. Connect your iOS device via USB.</p>
        <p style='color: #a1a1aa;'>2. Click <b>Check Device</b> to ensure connection.</p>
        <p style='color: #a1a1aa;'>3. Copy the <b>ECID</b> and register it on the website.</p>
        <p style='color: #a1a1aa;'>4. Click <b>Initiate Bypass</b> and wait for the process to complete.</p>
        <br>
        <h3 style='color: #fff;'>Troubleshooting</h3>
        <p style='color: #a1a1aa;'>- Ensure iTunes/Finder can see the device.</p>
        <p style='color: #a1a1aa;'>- If 'pymobiledevice3' is not found, install it via pip.</p>
        """)
        l.addWidget(txt)
        layout.addWidget(card)

    def log_msg(self, msg, color):
        self.console.append(f"<span style='color:{color}'>{msg}</span>")
        sb = self.console.verticalScrollBar()
        sb.setValue(sb.maximum())
    
    def update_progress(self, val):
        self.pbar.setValue(val)

    def check_device(self):
        self.status_lbl.setText("CONNECTING...")
        self.status_dot.setStyleSheet("color: #fbbf24; font-size: 18px;")
        self.worker = DeviceWorker()
        self.worker.info_ready.connect(self.on_dev_found)
        self.worker.error_occurred.connect(self.on_dev_err)
        self.worker.start()

    def on_dev_found(self, info):
        self.device_info = info
        self.val_model.setText(info['ModelName'])
        self.val_modelid.setText(info['ModelID'])
        self.val_ios.setText(info['iOS'])
        self.val_serial.setText(info['Serial'])
        self.val_imei.setText(info['IMEI'])
        self.val_act.setText(info['Activation'])
        self.val_ecid.setText(str(info['ECID']))
        
        color = "#4ade80" if "Activated" in info['Activation'] else "#f87171"
        self.val_act.setStyleSheet(f"color: {color};")
        
        self.status_lbl.setText("CONNECTED")
        self.status_dot.setStyleSheet("color: #4ade80; font-size: 18px;")
        self.log_msg(f"Device Connected: {info['ModelName']}", "#4ade80")

    def on_dev_err(self, err):
        self.status_lbl.setText("ERROR")
        self.status_dot.setStyleSheet("color: #ef4444; font-size: 18px;")
        self.log_msg(err, "#ef4444")

    def copy_ecid(self):
        txt = self.val_ecid.text()
        if txt and txt != "-":
            cb = QApplication.clipboard()
            cb.setText(txt)
            self.log_msg("ECID copied to clipboard.", "#22d3ee")

    def start_bypass(self):
        if not self.device_info.get("UDID"):
            QMessageBox.warning(self, "Error", "Please connect and check device first.")
            return
        
        self.btn_bypass.setEnabled(False)
        self.console.clear()
        self.pbar.setValue(0)
        
        self.bp_worker = BypassWorker(self.console_signal, self.device_info, True, "")
        self.bp_worker.finished.connect(self.on_bp_finish)
        self.bp_worker.start()

    def on_bp_finish(self, success, msg):
        self.btn_bypass.setEnabled(True)
        if success: 
            self.pbar.setValue(100)
            QMessageBox.information(self, "Success", msg)
        else: 
            self.log_msg(f"FAILED: {msg}", "#ef4444")
            self.pbar.setStyleSheet("QProgressBar::chunk { background-color: #ef4444; }")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    app.setStyleSheet(STYLESHEET)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
`;
