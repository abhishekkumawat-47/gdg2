import asyncio
from app.services.kafka_client import kafka_client

async def process_anomaly_event(topic: str, message: dict):
    """
    Callback function to handle incoming raw anomalies from Kafka.
    """
    print(f"Consumed event from topic {topic}: {message}")
    
    # 1. Filter out low confidence noise
    if message.get("confidence", 0) < 0.8:
        print("Ignoring low confidence anomaly.")
        return
        
    # 2. Process High confidence
    print(f"High confidence anomaly detected: {message.get('anomaly_type')}")
    
    # 3. Escalate to critical alerts topic
    await kafka_client.produce_event("alerts.critical", message)
    
    # Note: In a production setting, this logic could also call Neo4j here
    # to update Graph edge weights and push safe evcuation paths via WebSockets.

async def start_anomaly_consumer():
    """
    Starts the Kafka consumer looping in the background.
    """
    await kafka_client.start_consumer(["anomalies.raw"], process_anomaly_event)
