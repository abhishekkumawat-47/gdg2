import cv2
from ultralytics import YOLO

model = YOLO('best_fire.pt')
cap = cv2.VideoCapture('video/20260319-1959-00.1738062.mp4')
max_conf = 0.0

if not cap.isOpened():
    print("Could not open video.")
    exit()

print("Scanning for fireorsmoke...")
frame_idx = 0
found = False
while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break
    frame_idx += 1
    
    results = model(frame, verbose=False)
    for r in results:
        for box in r.boxes:
            c = float(box.conf[0])
            n = model.names[int(box.cls[0])]
            if c > max_conf:
                max_conf = c
            print(f"[Frame {frame_idx}] Detected {n} at {c:.2f} confidence!")
            found = True

print(f"Maximum confidence seen across all frames: {max_conf:.2f}")
if not found:
    print("Absolutely zero detections were made by the model!")
