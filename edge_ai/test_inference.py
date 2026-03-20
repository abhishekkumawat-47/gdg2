import cv2
import requests
import json
from datetime import datetime
from ultralytics import YOLO
import urllib.request

# 1. Download a test image
image_url = "https://ultralytics.com/images/zidane.jpg"
print(f"Downloading test image from {image_url}...")
urllib.request.urlretrieve(image_url, "test_image.jpg")

# 2. Load model
print("Loading YOLOv8 nano model...")
model = YOLO("yolov8n.pt")

# 3. Run inference
print("Running inference on test_image.jpg...")
results = model("test_image.jpg", verbose=False)

detected_label = ""
highest_conf = 0.0

print("-" * 40)
print("OBJECTS DETECTED BY YOLOv8:")
print("-" * 40)

for r in results:
    for box in r.boxes:
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])
        label = model.names[cls_id]
        
        print(f" -> Found '{label}' [Confidence: {conf:.2f}]")
        
        # We target 'person' class as our simulated anomaly
        if label == "person" and conf > 0.60:
            if conf > highest_conf:
                highest_conf = conf
                detected_label = "Person/Intrusion Detected"

# 4. Post to backend
print("-" * 40)
if detected_label:
    payload = {
        "camera_id": "test_script_01",
        "anomaly_type": detected_label,
        "confidence": round(highest_conf, 2),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    print(f"DISPATCHING PAYLOAD TO FASTAPI BACKEND:")
    print(json.dumps(payload, indent=2))
    print("...")
    
    try:
        response = requests.post("http://127.0.0.1:8000/api/v1/anomalies/", json=payload, timeout=5)
        print(f"Result HTTP Status Code : {response.status_code}")
        print(f"Result JSON Response    : {response.json()}")
    except Exception as e:
        print(f"Failed to reach backend: {e}")
else:
    print("No targeted anomalies detected.")
