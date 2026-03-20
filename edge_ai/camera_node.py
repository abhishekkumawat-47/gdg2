
import cv2
import time
import requests
from datetime import datetime
from ultralytics import YOLO

# Configuration
BACKEND_URL = "http://127.0.0.1:8000/api/v1/anomalies/"
CAMERA_ID = "edge_cam_01"
CONFIDENCE_THRESHOLD = 0.60
COOLDOWN_SECONDS = 5.0  # Prevent spamming the API

# Load YOLOv8 model (downloads yolov8n.pt automatically on first run)
print("Loading YOLOv8 nano model...")
model = YOLO("yolov8n.pt")
print("Model loaded. Starting camera feed...")

# Initialize webcam (0 is usually the default laptop camera)
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

last_alert_time = 0

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame.")
        break

    # Run inference on the frame (verbose=False to keep terminal clean)
    results = model(frame, verbose=False)

    anomaly_detected = False
    highest_conf = 0.0
    detected_label = ""

    # Parse results
    for r in results:
        boxes = r.boxes
        for box in boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            label = model.names[cls_id]

            # In a real model, we train for 'fire' and 'smoke'. 
            # For this COCO model, we map 'person' to 'Intrusion Detection' to demonstrate the pipeline.
            if label == "person" and conf > CONFIDENCE_THRESHOLD:
                anomaly_detected = True
                if conf > highest_conf:
                    highest_conf = conf
                    detected_label = "Person/Intrusion Detected"

    # Draw YOLO predictions on the frame for visual feedback
    annotated_frame = results[0].plot()
    
    # Show the feed to the user smoothly
    cv2.imshow("Smart Building Edge Node (Press 'q' to quit)", annotated_frame)

    # Dispatch event to the backend if cooldown has passed
    current_time = time.time()
    if anomaly_detected and (current_time - last_alert_time > COOLDOWN_SECONDS):
        payload = {
            "camera_id": CAMERA_ID,
            "anomaly_type": detected_label,
            "confidence": round(highest_conf, 2),
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        
        print(f"\n[ALERT] Dispatching to Backend -> {payload}")
        try:
            response = requests.post(BACKEND_URL, json=payload, timeout=2)
            if response.status_code == 200:
                print(" Successfully ingested by Kafka/MongoDB!")
            else:
                print(f" Failed to ingest. Status code: {response.status_code}")
        except Exception as e:
            print(f" Request failed: {e}")
            
        last_alert_time = current_time

    # Break loop on 'q' press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Cleanup
cap.release()
cv2.destroyAllWindows()
