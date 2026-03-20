from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.dependencies import get_redis

router = APIRouter()

class LocationUpdate(BaseModel):
    device_mac: str
    floor: int
    x: float
    y: float

@router.post("/update")
async def update_location(loc: LocationUpdate, redis=Depends(get_redis)):
    """
    Endpoint for WiFi/BLE gateways to update device positions
    """
    # Use Redis hashes for tracking fast-moving data
    key = f"user:loc:{loc.device_mac}"
    await redis.hset(key, mapping={
        "floor": loc.floor,
        "x": str(loc.x),
        "y": str(loc.y)
    })
    
    return {"status": "Location updated"}
