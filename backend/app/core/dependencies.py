import os
from motor.motor_asyncio import AsyncIOMotorClient
from neo4j import AsyncGraphDatabase
import redis.asyncio as redis
from app.core.config import settings

class DatabaseClient:
    def __init__(self):
        # Database placeholders
        self.mongo_client = None
        self.db = None
        self.redis_client = None
        self.neo4j_driver = None

    async def connect_to_databases(self):
        print("Connecting to MongoDB...")
        self.mongo_client = AsyncIOMotorClient(settings.MONGODB_URL)
        self.db = self.mongo_client[settings.MONGODB_DB_NAME]

        print("Connecting to Redis...")
        self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

        print("Connecting to Neo4j...")
        self.neo4j_driver = AsyncGraphDatabase.driver(
            settings.NEO4J_URI, 
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
        )

    async def close_database_connections(self):
        print("Closing database connections...")
        if self.mongo_client:
            self.mongo_client.close()
        if self.redis_client:
            await self.redis_client.close()
        if self.neo4j_driver:
            await self.neo4j_driver.close()

db_client = DatabaseClient()

# FastAPI Dependencies
async def get_mongo_db():
    return db_client.db

async def get_redis():
    return db_client.redis_client

async def get_neo4j():
    async with db_client.neo4j_driver.session() as session:
        yield session
