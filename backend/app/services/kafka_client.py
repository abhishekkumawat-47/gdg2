import json
from aiokafka import AIOKafkaProducer, AIOKafkaConsumer
from app.core.config import settings
import asyncio

class KafkaClient:
    def __init__(self):
        self.producer = None
        self.consumer_task = None

    async def start_producer(self):
        print(f"Connecting to Kafka Producer at {settings.KAFKA_BOOTSTRAP_SERVERS}...")
        self.producer = AIOKafkaProducer(
            bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        await self.producer.start()
        print("Kafka Producer started successfully")

    async def stop_producer(self):
        if self.producer:
            await self.producer.stop()
            print("Kafka Producer stopped")

    async def produce_event(self, topic: str, message: dict):
        if self.producer:
            await self.producer.send_and_wait(topic, message)

    async def start_consumer(self, topics, callback):
        consumer = AIOKafkaConsumer(
            *topics,
            bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            group_id="smart-building-group"
        )
        await consumer.start()
        print(f"Kafka Consumer started for topics: {topics}")
        try:
            async for msg in consumer:
                await callback(msg.topic, msg.value)
        finally:
            await consumer.stop()

# Singleton instance
kafka_client = KafkaClient()
