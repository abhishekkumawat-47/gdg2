import cv2
import requests
import os
import glob
from datetime import datetime
from ultralytics import YOLO
import argparse

# Configuration
BACKEND_URL = "http://127.0.0.1:8000/api/v1/anomalies/"
VIDEOS_DIR = "video/"
CONFIDENCE_THRESHOLD = 0.50

# In a real system you will fine-tune this YOLO model on 'fire' and 'smoke' datasets.
# For this demo, we use standard YOLOv8 which detects 'person' (Class 0) natively.
TARGET_CLASSES = ["person", "fire", "smoke", "fireorsmoke"] 

def process_video(video_path, model):
    filename = os.path.basename(video_path)
    print(f"\n{'='*60}")
    print(f"[{filename}] Analyzing video clip...")
    print(f"{'='*60}")
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Could not open {video_path}")
        return

    frame_count = 0
    anomaly_found = False

    while cap.isOpened() and not anomaly_found:
        ret, frame = cap.read()
        if not ret:
            break
            
        frame_count += 1
        # Analyze every 5th frame to speed up the batch testing organically
        if frame_count % 5 != 0:
            continue

        results = model(frame, verbose=False)
        
        for r in results:
            for box in r.boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                label = model.names[cls_id]

                if label in TARGET_CLASSES and conf > CONFIDENCE_THRESHOLD:
                    # We found an anomaly!
                    anomaly_type = label.upper()
                    if label == "person":
                        anomaly_type = "INTRUDER_DETECTED"
                    elif label in ["fire", "smoke", "fireorsmoke"]:
                        anomaly_type = "FIRE_DETECTED"
                        
                    payload = {
                        "camera_id": f"test_video_{filename}",
                        "anomaly_type": anomaly_type,
                        "confidence": round(conf, 2),
                        "timestamp": datetime.utcnow().isoformat() + "Z"
                    }
                    
                    print(f" -> [ML ALERT] {anomaly_type} detected at frame {frame_count} with {conf:.2f} confidence!")
                    print(f"    Dispatching Kafka payload to Backend: {payload}")
                    
                    try:
                        response = requests.post(BACKEND_URL, json=payload, timeout=2)
                        print(f"    Backend Response [{response.status_code}]: {response.json()}")
                    except Exception as e:
                        print(f"    Backend network unreachable: {e}")
                        
                    # Stop processing this video once we confirm the anomaly logic correctly fired
                    anomaly_found = True
                    break
            if anomaly_found:
                break

    cap.release()
    if not anomaly_found:
        print(f" -> [SAFE] No anomalies detected in {filename}.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch Video Tester for Edge AI")
    parser.add_argument("--model", type=str, default="yolov8n.pt", help="Path to YOLOv8 weights file (.pt)")
    args = parser.parse_args()

    print(f"Loading YOLOv8 ML Model from '{args.model}'...")
    try:
        yolo_model = YOLO(args.model)
    except Exception as e:
        print(f"Failed to load model '{args.model}': {e}")
        print("Please ensure the .pt file is inside the edge_ai directory!")
        exit(1)
        
    # Ensure videos directory exists
    os.makedirs(VIDEOS_DIR, exist_ok=True)
    
    # Look for any mp4 files in the directory
    video_files = glob.glob(os.path.join(VIDEOS_DIR, "*.mp4"))
    
    if not video_files:
        print(f"\n[INFO] No videos found in '{VIDEOS_DIR}'.") 
        print(f"Please drop some .mp4 dummy clips demonstrating intrusion/fire into this folder and run again!")
    else:
        print(f"Found {len(video_files)} video clips to batch test.")
        for vid in video_files:
            process_video(vid, yolo_model)
