import cv2
from datetime import datetime
import json
import requests
from ultralytics import YOLO

print("Loading 'best_fire.pt' Hugging Face model...")
model = YOLO('best_fire.pt')

image_path = r"C:\Users\DELL\.gemini\antigravity\brain\307796d9-b966-43ed-9ba0-8a2068f348c1\raging_fire_1773951786074.png"
print(f"{'='*50}")
print(f"Scanning local generated image for 'fireorsmoke'...")
print(f"{'='*50}")

results = model(image_path, verbose=False)

highest_conf = 0.0
detected_class = ""

for r in results:
    for box in r.boxes:
        c = float(box.conf[0])
        n = model.names[int(box.cls[0])]
        print(f" -> Found '{n}' with confidence {c:.2f}")
        if c > highest_conf:
            highest_conf = c
            detected_class = n

print(f"\n[OUTPUT] Identified Target: '{detected_class}' (Confidence: {highest_conf:.2f})")

if highest_conf >= 0.05:
    payload = {
        "camera_id": "test_image_fire_synthetic_01",
        "anomaly_type": "FIRE_DETECTED",
        "confidence": round(highest_conf, 2),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    print(f"Dispatching payload to FastAPI backend:")
    print(json.dumps(payload, indent=2))
    try:
        res = requests.post("http://127.0.0.1:8000/api/v1/anomalies/", json=payload, timeout=2)
        print(f"Backend Server Response [{res.status_code}]: {res.json()}")
    except Exception as e:
        print(f"Backend unreachable: {e}")
else:
    print("\n[SAFE] The model evaluated the image but confidence was practically zero.")
