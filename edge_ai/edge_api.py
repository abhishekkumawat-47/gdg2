import os
import cv2
import requests
import shutil
import json
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

app = FastAPI(title="Edge AI Video Processor")

# Add CORS so the Next.js frontend can upload files directly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BACKEND_URL = os.getenv("BACKEND_API_URL", "http://127.0.0.1:8000/api/v1/anomalies/")
VIDEOS_DIR = "video/"
CONFIDENCE_THRESHOLD = 0.50
TARGET_CLASSES = ["person", "fire", "smoke", "fireorsmoke"]

# Ensure video dir exists
os.makedirs(VIDEOS_DIR, exist_ok=True)

# Centralized JSON logger
def log_model_output(filename: str, status: str, details: dict = None):
    log_file = "model_outputs.json"
    entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "video": filename,
        "status": status,
        "details": details or {}
    }
    
    logs = []
    if os.path.exists(log_file):
        try:
            with open(log_file, "r") as f:
                logs = json.load(f)
        except json.JSONDecodeError:
            pass
            
    logs.append(entry)
    
    with open(log_file, "w") as f:
        json.dump(logs, f, indent=4)

# Load YOLO model at startup
print("Loading YOLOv8 model for Edge API...")
try:
    yolo_model = YOLO("best_fire.pt") # Using your custom trained fire/smoke model
except Exception as e:
    print(f"Failed to load model: {e}")
    yolo_model = None

def process_video_background(video_path: str, filename: str):
    if yolo_model is None:
        print("Model not loaded. Cannot process video.")
        return

    print(f"[{filename}] Background processing started...")
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
        # Analyze every 5th frame
        if frame_count % 5 != 0:
            continue

        results = yolo_model(frame, verbose=False)
        
        for r in results:
            for box in r.boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                label = yolo_model.names[cls_id]

                if label in TARGET_CLASSES and conf > CONFIDENCE_THRESHOLD:
                    anomaly_type = label.upper()
                    if label == "person":
                        anomaly_type = "INTRUDER_DETECTED"
                    elif label in ["fire", "smoke", "fireorsmoke"]:
                        anomaly_type = "FIRE_DETECTED"
                        
                    payload = {
                        "camera_id": f"uploaded_{filename}",
                        "anomaly_type": anomaly_type,
                        "confidence": round(conf, 2),
                        "timestamp": datetime.utcnow().isoformat() + "Z"
                    }
                    
                    print(f" -> [ML ALERT] {anomaly_type} detected at frame {frame_count} with {conf:.2f} confidence!")
                    try:
                        response = requests.post(BACKEND_URL, json=payload, timeout=2)
                        print(f"    Backend Response [{response.status_code}]: {response.json()}")
                    except Exception as e:
                        print(f"    Backend network unreachable: {e}")
                        
                    anomaly_found = True
                    log_model_output(filename, "ANOMALY_DETECTED", payload)
                    break
            if anomaly_found:
                break

    cap.release()
    if not anomaly_found:
        print(f" -> [SAFE] No anomalies detected in {filename}.")
        log_model_output(filename, "SAFE")
    else:
        print(f" -> [PROCESSED] Analysis finished for {filename} (Anomaly Detected).")

@app.post("/upload-video")
async def upload_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """
    Endpoint to receive a video, save it, and start YOLO processing in the background.
    """
    file_path = os.path.join(VIDEOS_DIR, file.filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Queue background processing
    background_tasks.add_task(process_video_background, file_path, file.filename)
    
    return {
        "status": "success",
        "message": "Video uploaded successfully. Processing started.",
        "filename": file.filename
    }
