from huggingface_hub import HfApi, hf_hub_download
import os

api = HfApi()
print("Searching HuggingFace for 'yolov8 fire smoke' models...")
models = list(api.list_models(search="yolov8 fire smoke", limit=20))

downloaded = False
for m in models:
    repo_id = m.modelId
    print(f"Checking {repo_id}...")
    try:
        files = api.list_repo_files(repo_id)
        pt_files = [f for f in files if f.endswith(".pt")]
        
        if pt_files:
            target_file = pt_files[0]
            if "best.pt" in pt_files:
                target_file = "best.pt"
            
            print(f"Found {target_file} in {repo_id}! Downloading...")
            downloaded_path = hf_hub_download(repo_id=repo_id, filename=target_file, local_dir=".")
            
            # Since hugging face might download as `best.pt`, safely rename it or just use it.
            if os.path.exists("best_fire.pt"):
                os.remove("best_fire.pt")
            os.rename(downloaded_path, "best_fire.pt")
            print("Successfully downloaded to best_fire.pt")
            downloaded = True
            break
    except Exception as e:
        print(f"Skipping {repo_id} due to error: {e}")

if not downloaded:
    print("Could not find a valid .pt model.")
