from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from app.core.dependencies import get_mongo_db
from app.services.kafka_client import kafka_client
from app.services.websocket_manager import manager
from typing import List

router = APIRouter()

class MLInferenceEvent(BaseModel):
    camera_id: str
    anomaly_type: str = Field(..., description="Fire, Smoke, Intrusion, etc.")
    confidence: float
    timestamp: str

@router.post("/")
async def receive_anomaly(event: MLInferenceEvent, db=Depends(get_mongo_db)):
    """
    Endpoint for Edge AI to post detected anomalies (Fire, Smoke, Intrusion)
    """
    event_dict = event.dict()
    
    # 1. Log to Database (MongoDB)
    await db["anomaly_events"].insert_one(event_dict.copy())
    
    # 2. Add to Streaming Queue (Kafka)
    await kafka_client.produce_event("anomalies.raw", event_dict)
    
    # Optimistically broadcast to dashboard
    alert_payload = {
        "event_type": "CRITICAL_ALERT",
        "details": event_dict
    }
    await manager.broadcast(alert_payload)
    
    return {"status": "Event received, saved, and queued into Kafka"}

@router.get("/active")
async def get_active_anomalies(db=Depends(get_mongo_db)):
    """
    Fetch all active (unresolved) emergencies.
    """
    cursor = db["anomaly_events"].find({"resolved": {"$ne": True}})
    anomalies = await cursor.to_list(length=100)
    
    # Convert ObjectId to string for JSON serialization
    for anomaly in anomalies:
        anomaly["_id"] = str(anomaly["_id"])
        
    return {"active_anomalies": anomalies}
