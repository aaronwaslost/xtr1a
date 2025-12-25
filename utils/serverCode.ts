export const flaskServerCode = `from flask import Flask, request, jsonify
import sqlite3
import os

# ==========================================
# PYTHONANYWHERE FLASK CONFIGURATION
# ==========================================
# 1. Upload this file as 'flask_app.py' to your PythonAnywhere directory.
# 2. Go to the "Web" tab and configure your WSGI file to import 'app' from this file.
# 3. Create a 'static' folder for your payload files if needed.

app = Flask(__name__)
DB_FILE = "devices.db"

def init_db():
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS devices 
                     (ecid TEXT PRIMARY KEY, 
                      ip_address TEXT, 
                      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
        conn.commit()

# Ensure DB exists on startup
if not os.path.exists(DB_FILE):
    init_db()

@app.route('/')
def index():
    return jsonify({"status": "Xtr1a Activator Server Online", "version": "1.0.3"})

@app.route('/register_ecid', methods=['GET', 'POST'])
def register():
    """Endpoint for the Web App to register a device."""
    ecid = request.args.get('ecid')
    if not ecid:
        return jsonify({"success": False, "message": "Missing ECID parameter"}), 400
    
    ecid = ecid.upper().strip()
    client_ip = request.remote_addr
    
    try:
        with sqlite3.connect(DB_FILE) as conn:
            # Insert or replace to allow re-registration
            conn.execute("INSERT OR REPLACE INTO devices (ecid, ip_address) VALUES (?, ?)", (ecid, client_ip))
        return jsonify({"success": True, "message": f"ECID {ecid} Registered Successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/check_ecid', methods=['GET'])
def check():
    """Endpoint for the Python Tool to verify permission."""
    ecid = request.args.get('ecid')
    if not ecid:
        return "MISSING_PARAM", 400
    
    ecid = ecid.upper().strip()
    
    with sqlite3.connect(DB_FILE) as conn:
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM devices WHERE ecid = ?", (ecid,))
        row = cur.fetchone()
        
    if row:
        return "REGISTERED"
    else:
        return "UNREGISTERED"

@app.route('/get_payload', methods=['GET'])
def get_payload():
    """Endpoint to return payload URLs."""
    guid = request.args.get('guid')
    model = request.args.get('prd')
    
    # NOTE: You must host your 'payload.db' file.
    # On PythonAnywhere, put it in a 'static' folder and use the URL below.
    # payload_url = f"{request.url_root}static/payload.db"
    
    # For now, we return a placeholder or a direct link if you have one
    payload_url = "https://github.com/rhcp011235/A12_Bypass_OSS/raw/main/payload.db" 

    return jsonify({
        "success": True,
        "links": {
            "step1_fixedfile": payload_url,
            "step2_bldatabase": payload_url,
            "step3_final": payload_url
        }
    })

if __name__ == '__main__':
    app.run(port=8000)`;