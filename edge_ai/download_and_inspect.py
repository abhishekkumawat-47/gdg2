from huggingface_hub import hf_hub_download
from ultralytics import YOLO

print("Downloading fire model from Hugging Face...")
model_path = hf_hub_download(repo_id="touati-kamel/yolov8s-forest-fire-detection", filename="best.pt", local_dir=".")

print("Loading model...")
model = YOLO(model_path)
print("Model classes:")
print(model.names)
