
export const pythonSourceCode = `import sys
import os
import time
import subprocess
import re
import shutil
import sqlite3
import json
import socket
import threading
import urllib.request
import urllib.error
import zipfile
import io

# GUI Imports
try:
    from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                                 QHBoxLayout, QLabel, QPushButton, QLineEdit, 
                                 QTextEdit, QTabWidget, QGroupBox, QComboBox, 
                                 QMessageBox, QProgressBar, QFrame, QScrollArea,
                                 QRadioButton, QFileDialog, QSplitter, QGridLayout)
    from PyQt6.QtCore import Qt, QThread, pyqtSignal, QObject, QTimer, QSize, QByteArray
    from PyQt6.QtGui import QFont, QIcon, QColor, QPalette, QCursor, QGradient, QBrush, QLinearGradient, QClipboard
except ImportError:
    print("CRITICAL ERROR: PyQt6 is not installed.")
    print("Please run: pip install PyQt6 pymobiledevice3 requests")
    sys.exit(1)

# --- Configuration ---
APP_NAME = "Xtr1a Activator"
VERSION = "v1.0.4"
SERVER_URL = "https://aaronkotlin.pythonanywhere.com"

# --- Modern Cyber-Clean Stylesheet ---
STYLESHEET = """
QMainWindow {
    background-color: #09090b; /* Zinc 950 */
}
QWidget {
    font-family: 'Segoe UI', 'Inter', sans-serif;
    font-size: 13px;
    color: #e4e4e7; /* Zinc 200 */
}
QFrame#SidePanel {
    background-color: #000000;
    border-right: 1px solid #27272a; /* Zinc 800 */
}
QFrame#Header {
    background-color: #09090b;
    border-bottom: 1px solid #27272a;
}
QLabel#HeaderTitle {
    font-size: 24px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.5px;
}
QLabel#VersionTag {
    color: #06b6d4; /* Cyan 500 */
    background-color: rgba(6, 182, 212, 0.1);
    border: 1px solid rgba(6, 182, 212, 0.2);
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 600;
}
QLabel#SectionTitle {
    font-size: 11px;
    font-weight: 700;
    color: #71717a; /* Zinc 500 */
    text-transform: uppercase;
    letter-spacing: 1.2px;
    margin-bottom: 8px;
}
QLabel#DetailLabel {
    color: #71717a; 
    font-size: 10px; 
    font-weight: 700;
    text-transform: uppercase;
}
QLabel#DetailValue {
    color: #e4e4e7; 
    font-family: 'Consolas', monospace; 
    font-size: 13px;
    padding-bottom: 2px;
    border-bottom: 1px solid #27272a;
}
QLineEdit {
    background-color: #18181b; /* Zinc 900 */
    border: 1px solid #27272a;
    border-radius: 6px;
    padding: 12px;
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
    border-color: #18181b;
}
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
    border-color: #3f3f46;
}
QPushButton:pressed {
    background-color: #000000;
}
QPushButton#PrimaryButton {
    background-color: #0891b2; /* Cyan 600 */
    border: 1px solid #0e7490;
    color: #ffffff;
    font-size: 14px;
    padding: 14px;
}
QPushButton#PrimaryButton:hover {
    background-color: #06b6d4; /* Cyan 500 */
}
QPushButton#PrimaryButton:disabled {
    background-color: #1e293b;
    border-color: #334155;
    color: #64748b;
}
QPushButton#SmallBtn {
    padding: 4px 8px;
    font-size: 10px;
    border-radius: 4px;
    background-color: #27272a;
}
QPushButton#SmallBtn:hover {
    background-color: #3f3f46;
}
QPushButton#DestructiveButton {
    background-color: rgba(220, 38, 38, 0.1);
    border: 1px solid rgba(220, 38, 38, 0.3);
    color: #f87171;
}
QPushButton#DestructiveButton:hover {
    background-color: #dc2626;
    color: white;
}
QTextEdit {
    background-color: #000000;
    border: 1px solid #27272a;
    border-radius: 8px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 12px;
    padding: 12px;
    line-height: 1.4;
    color: #d4d4d8;
}
QGroupBox {
    border: 1px solid #27272a;
    border-radius: 8px;
    margin-top: 12px;
    padding-top: 24px;
    padding-bottom: 12px;
    background-color: #0c0c0e;
}
QGroupBox::title {
    subcontrol-origin: margin;
    left: 12px;
    top: 8px;
    padding: 0 4px;
    color: #22d3ee; /* Cyan 400 */
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
QTabWidget::pane { border: 0; background: transparent; }
QTabBar::tab {
    background-color: transparent;
    color: #71717a;
    padding: 12px 0;
    margin-right: 24px;
    font-weight: 600;
    border-bottom: 2px solid transparent;
}
QTabBar::tab:selected {
    color: #06b6d4;
    border-bottom: 2px solid #06b6d4;
}
"""

# --- Worker Classes ---

class ConsoleSignal(QObject):
    text_written = pyqtSignal(str, str)

class DeviceWorker(QThread):
    info_ready = pyqtSignal(dict)
    error_occurred = pyqtSignal(str)

    def run(self):
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
            self.error_occurred.emit(f"Failed to detect device. Ensure device is connected and unlocked.")

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
            self.error_occurred.emit("Device detected but UDID is missing. Trust Computer?")
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
        # Hardcoded Server URL
        self.base_url = SERVER_URL
        self.auto_guid = use_auto_guid
        self.man_guid = manual_guid

    def log(self, msg, color="#a1a1aa"):
        self.console.text_written.emit(msg, color)

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
        ecid = self.dev.get("ECID")
        self.log(f"Verifying ECID {ecid} with cloud...", "#d4d4d8")
        
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
        except urllib.error.HTTPError as e:
             self.log(f"HTTP Error {e.code}: Check server status.", "#ef4444")
             return False
        except Exception as e:
            self.log(f"Connection failed: {e}", "#ef4444")
            return False

    def run(self):
        self.log(f"--- Starting Bypass Process {VERSION} ---", "#22d3ee")
        
        if not self.check_registration():
            self.finished.emit(False, "ECID Registration Required")
            return

        max_retries = 6
        guid = None

        if self.auto_guid:
            for attempt in range(1, max_retries + 1):
                self.log(f"Attempt {attempt}/{max_retries}: Scanning for Activation GUID...", "#fbbf24")
                
                guid = self.detect_guid_once()
                
                if guid:
                    break
                
                if attempt < max_retries:
                    self.log(f"GUID not found. Rebooting device to trigger logs...", "#ef4444")
                    self.perform_reboot()
                    self.wait_for_device() 
                else:
                    self.log("Max retries reached. Could not find GUID.", "#ef4444")
                    self.finished.emit(False, "Failed to find GUID after 6 reboots")
                    return
        else:
            guid = self.man_guid
            self.log(f"Using Manual GUID: {guid}", "#38bdf8")

        if not guid:
            self.finished.emit(False, "No GUID available")
            return
            
        self.log(f"GUID Acquired: {guid}", "#4ade80")
        
        self.log("Requesting payload URLs...", "#d4d4d8")
        s1, s2, s3 = self.get_urls(guid)
        
        if not s3:
            self.log("Failed to get payload URLs. Check Server.", "#ef4444")
            self.finished.emit(False, "Server Error")
            return
            
        self.log("Downloading Stage 3 Payload...", "#d4d4d8")
        if self.download_and_push(s3):
            self.log("✅ Payload Successfully Deployed!", "#4ade80")
            self.log("FINAL STEPS:", "#fbbf24")
            self.log("1. Device will reboot automatically (or do it manually)", "#e4e4e7")
            self.log("2. Copy /iTunes_Control/iTunes/iTunesMetadata.plist to /Books/", "#e4e4e7")
            self.finished.emit(True, "Deployment Complete")
        else:
            self.finished.emit(False, "Deployment Failed")

    def perform_reboot(self):
        try:
            flags = subprocess.CREATE_NO_WINDOW if sys.platform == 'win32' else 0
            subprocess.Popen([sys.executable, "-m", "pymobiledevice3", "diagnostics", "restart"], creationflags=flags)
            self.log("Reboot signal sent.", "#d4d4d8")
        except:
            self.log("Reboot command failed. Please reboot manually.", "#ef4444")

    def wait_for_device(self):
        self.log("Waiting for device to reconnect (max 60s)...", "#d4d4d8")
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
        self.log("Timeout waiting for device. Proceeding anyway...", "#facc15")

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
        url = f"{self.base_url}/get_payload?prd={prd}&guid={guid}&sn={sn}"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as r:
                out = r.read().decode('utf-8')
                js = json.loads(out)
                if js.get('success'):
                    l = js['links']
                    return l.get('step1_fixedfile'), l.get('step2_bldatabase'), l.get('step3_final')
        except Exception as e:
            self.log(f"URL Fetch Error: {e}", "#ef4444")
        return None, None, None

    def download_and_push(self, url):
        local = "payload.db"
        if os.path.exists(local): os.remove(local)
        self.run_cmd(["curl", "-L", "-o", local, url])
        try:
            conn = sqlite3.connect(local)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='asset'")
            if not cursor.fetchone():
                conn.close()
                return False
            conn.close()
        except:
            return False
        target = "/Downloads/downloads.28.sqlitedb"
        self.log("Pushing payload...", "#d4d4d8")
        self.run_cmd([sys.executable, "-m", "pymobiledevice3", "afc", "rm", target])
        c, _, _ = self.run_cmd([sys.executable, "-m", "pymobiledevice3", "afc", "push", local, target])
        return c == 0

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle(f"{APP_NAME} {VERSION}")
        self.resize(1100, 800)
        self.device_info = {}
        self.console_signal = ConsoleSignal()
        self.console_signal.text_written.connect(self.log_msg)
        self.init_ui()

    def init_ui(self):
        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        main_layout = QHBoxLayout(main_widget)
        main_layout.setContentsMargins(0,0,0,0)
        main_layout.setSpacing(0)
        side_panel = QFrame()
        side_panel.setObjectName("SidePanel")
        side_panel.setFixedWidth(260)
        sp_layout = QVBoxLayout(side_panel)
        sp_layout.setContentsMargins(24, 40, 24, 24)
        logo_lbl = QLabel(APP_NAME.split(' ')[0])
        logo_lbl.setObjectName("HeaderTitle")
        sp_layout.addWidget(logo_lbl)
        ver_lbl = QLabel(VERSION)
        ver_lbl.setObjectName("VersionTag")
        ver_lbl.setFixedSize(100, 22)
        ver_lbl.setAlignment(Qt.AlignmentFlag.AlignCenter)
        sp_layout.addWidget(ver_lbl)
        sp_layout.addSpacing(50)
        
        self.nav_btns = []
        icons = ["🖥️", "📖"]
        labels = ["Dashboard", "Guide & Info"]
        
        for i, text in enumerate(labels):
            btn = QPushButton(f"{icons[i]}   {text}")
            btn.setCheckable(True)
            btn.setFixedHeight(48)
            btn.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))
            btn.setStyleSheet("""
                QPushButton { text-align: left; padding-left: 20px; border: 0; background: transparent; color: #a1a1aa; font-size: 14px; font-weight: 500; border-radius: 8px; }
                QPushButton:checked { color: #ffffff; font-weight: 600; background: #18181b; border: 1px solid #27272a; }
                QPushButton:hover { color: #ffffff; background: #09090b; }
            """)
            btn.clicked.connect(lambda c, idx=i: self.change_tab(idx))
            sp_layout.addWidget(btn)
            sp_layout.addSpacing(4)
            self.nav_btns.append(btn)
            
        sp_layout.addStretch()
        main_layout.addWidget(side_panel)
        content_area = QWidget()
        ca_layout = QVBoxLayout(content_area)
        ca_layout.setContentsMargins(0,0,0,0)
        header = QFrame()
        header.setObjectName("Header")
        header.setFixedHeight(70)
        h_layout = QHBoxLayout(header)
        h_layout.setContentsMargins(40, 0, 40, 0)
        self.header_title = QLabel("DASHBOARD")
        self.header_title.setStyleSheet("font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px;")
        h_layout.addWidget(self.header_title)
        ca_layout.addWidget(header)
        
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
        layout = QHBoxLayout(self.page_dash)
        layout.setContentsMargins(40, 40, 40, 40)
        layout.setSpacing(40)
        left_panel = QWidget()
        lp_layout = QVBoxLayout(left_panel)
        lp_layout.setContentsMargins(0,0,0,0)
        lp_layout.setSpacing(20)
        left_panel.setFixedWidth(450)
        conn_box = QFrame()
        conn_box.setStyleSheet("background-color: #0c0c0e; border: 1px solid #27272a; border-radius: 8px;")
        conn_layout = QHBoxLayout(conn_box)
        conn_layout.setContentsMargins(16, 16, 16, 16)
        self.status_lbl = QLabel("DISCONNECTED")
        self.status_lbl.setStyleSheet("color: #71717a; font-weight: 800; font-size: 16px;")
        btn_check = QPushButton("CHECK DEVICE")
        btn_check.setObjectName("PrimaryButton")
        btn_check.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))
        btn_check.clicked.connect(self.check_device)
        conn_layout.addWidget(self.status_lbl)
        conn_layout.addStretch()
        conn_layout.addWidget(btn_check)
        dev_box = QGroupBox("DEVICE IDENTITY")
        grid = QGridLayout()
        grid.setContentsMargins(16, 24, 16, 16)
        grid.setVerticalSpacing(20)
        grid.setHorizontalSpacing(24)
        def mk_field(row, col, title, obj_name, colspan=1):
            lbl = QLabel(title)
            lbl.setObjectName("DetailLabel")
            val = QLabel("-")
            val.setObjectName("DetailValue")
            grid.addWidget(lbl, row*2, col, 1, colspan)
            grid.addWidget(val, row*2+1, col, 1, colspan)
            setattr(self, obj_name, val)
        mk_field(0, 0, "MODEL NAME", "val_model")
        mk_field(0, 1, "IOS VERSION", "val_ios")
        mk_field(1, 0, "MODEL IDENTIFIER", "val_modelid")
        mk_field(1, 1, "SERIAL NUMBER", "val_serial")
        mk_field(2, 0, "IMEI", "val_imei")
        mk_field(2, 1, "ACTIVATION STATE", "val_act")
        mk_field(3, 0, "STORAGE CAPACITY", "val_storage", 2)
        lbl_ecid = QLabel("ECID (UNIQUE CHIP ID)")
        lbl_ecid.setObjectName("DetailLabel")
        grid.addWidget(lbl_ecid, 8, 0, 1, 2)
        ecid_layout = QHBoxLayout()
        self.val_ecid = QLineEdit()
        self.val_ecid.setReadOnly(True)
        self.val_ecid.setText("-")
        self.val_ecid.setStyleSheet("background: transparent; border: none; border-bottom: 1px solid #27272a; color: #e4e4e7; font-family: 'Consolas'; padding: 0; padding-bottom: 4px;")
        btn_copy = QPushButton("COPY")
        btn_copy.setObjectName("SmallBtn")
        btn_copy.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))
        btn_copy.setFixedWidth(60)
        btn_copy.clicked.connect(self.copy_ecid)
        ecid_layout.addWidget(self.val_ecid)
        ecid_layout.addWidget(btn_copy)
        grid.addLayout(ecid_layout, 9, 0, 1, 2)
        dev_box.setLayout(grid)
        self.btn_bypass = QPushButton("INITIATE BYPASS SEQUENCE")
        self.btn_bypass.setObjectName("PrimaryButton")
        self.btn_bypass.setFixedHeight(56)
        self.btn_bypass.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))
        self.btn_bypass.clicked.connect(self.start_bypass)
        lp_layout.addWidget(conn_box)
        lp_layout.addWidget(dev_box)
        lp_layout.addStretch()
        lp_layout.addWidget(self.btn_bypass)
        right_panel = QWidget()
        rp_layout = QVBoxLayout(right_panel)
        rp_layout.setContentsMargins(0,0,0,0)
        lbl_con = QLabel("SYSTEM TERMINAL")
        lbl_con.setObjectName("SectionTitle")
        self.console = QTextEdit()
        self.console.setReadOnly(True)
        rp_layout.addWidget(lbl_con)
        rp_layout.addWidget(self.console)
        layout.addWidget(left_panel)
        layout.addWidget(right_panel)

    def build_guide_page(self):
        layout = QVBoxLayout(self.page_guide)
        layout.setContentsMargins(40, 40, 40, 40)
        txt = QTextEdit()
        txt.setReadOnly(True)
        txt.setHtml("<h3>INSTRUCTIONS</h3><p>1. Connect Device & Click Check.</p><p>2. Copy the ECID and Register it via the Web Dashboard.</p><p>3. Click Initiate Bypass.</p>")
        layout.addWidget(txt)

    def log_msg(self, msg, color):
        self.console.append(f"<span style='color:{color}'>{msg}</span>")
        sb = self.console.verticalScrollBar()
        sb.setValue(sb.maximum())

    def check_device(self):
        self.status_lbl.setText("CONNECTING...")
        self.status_lbl.setStyleSheet("color: #fbbf24; font-weight: 800; font-size: 16px;")
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
        self.val_storage.setText(info['Capacity'])
        color = "#4ade80" if "Activated" in info['Activation'] else "#f87171"
        self.val_act.setStyleSheet(f"color: {color}; font-family: 'Consolas'; font-weight: bold; border-bottom: 1px solid #27272a;")
        self.status_lbl.setText("CONNECTED")
        self.status_lbl.setStyleSheet("color: #4ade80; font-weight: 800; font-size: 16px;")
        self.log_msg(f"Connected: {info['ModelName']}", "#4ade80")

    def on_dev_err(self, err):
        self.status_lbl.setText("ERROR")
        self.status_lbl.setStyleSheet("color: #ef4444; font-weight: 800; font-size: 16px;")
        self.log_msg(err, "#ef4444")

    def copy_ecid(self):
        txt = self.val_ecid.text()
        if txt and txt != "-":
            cb = QApplication.clipboard()
            cb.setText(txt)
            self.log_msg("ECID copied to clipboard.", "#22d3ee")

    def start_bypass(self):
        if not self.device_info.get("UDID"):
            QMessageBox.warning(self, "Error", "Check device first.")
            return
        
        self.btn_bypass.setEnabled(False)
        self.console.clear()
        
        # Hardcoded True for auto_guid, empty string for manual
        self.bp_worker = BypassWorker(self.console_signal, self.device_info, True, "")
        self.bp_worker.finished.connect(self.on_bp_finish)
        self.bp_worker.start()

    def on_bp_finish(self, success, msg):
        self.btn_bypass.setEnabled(True)
        if success: QMessageBox.information(self, "Success", msg)
        else: self.log_msg(f"FAILED: {msg}", "#ef4444")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    app.setStyleSheet(STYLESHEET)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
`;
