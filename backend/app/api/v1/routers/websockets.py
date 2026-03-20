from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websocket_manager import manager

router = APIRouter()

@router.websocket("/dashboard")
async def dashboard_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for the Admin God-View Dashboard.
    Pushes real-time anomalies and crowd density updates.
    """
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received from Dashboard: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
