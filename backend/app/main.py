from contextlib import asynccontextmanager
import asyncio
from fastapi import FastAPI
import asyncio

from app.core.dependencies import db_client
from app.services.kafka_client import kafka_client
from app.services.anomaly_consumer import start_anomaly_consumer
from app.api.v1.api import api_router
from app.api.v1.routers.websockets import router as ws_router

# Lifespan context to handle startup/shutdown of connections (e.g. Kafka/Redis)
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up Connections (Kafka, Redis, MongoDB, Neo4j)...")
    await db_client.connect_to_databases()
    await kafka_client.start_producer()
    
    # Start consumer tasks in the background
    consumer_task = asyncio.create_task(start_anomaly_consumer())
    
    yield
    
    print("Shutting down Connections...")
    consumer_task.cancel()
    await kafka_client.stop_producer()
    await db_client.close_database_connections()

app = FastAPI(
    title="Smart Building Safety Platform",
    description="Real-time event processing for CCTV anomalies and indoor tracking",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(api_router, prefix="/api/v1")
app.include_router(ws_router, prefix="/ws")
