import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Building Safety Platform"
    VERSION: str = "1.0.0"

    # Infrastructure Configurtions
    KAFKA_BOOTSTRAP_SERVERS: str = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # MongoDB Config
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://admin:secretpassword@localhost:27017/?authSource=admin")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "smart_building_db")

    # Neo4j Config
    NEO4J_URI: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    NEO4J_USER: str = os.getenv("NEO4J_USER", "neo4j")
    NEO4J_PASSWORD: str = os.getenv("NEO4J_PASSWORD", "secretpassword")

    # Supabase / Postgres Config for future auth + app data
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_DB_URL: str = os.getenv("SUPABASE_DB_URL", "")
    AUTH_PROVIDER: str = os.getenv("AUTH_PROVIDER", "supabase")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    # Twilio SMS Config
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_FROM_NUMBER: str = os.getenv("TWILIO_FROM_NUMBER", "")

    # Frontend + Local Dev Config
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    ENABLE_INFRA_ON_STARTUP: bool = os.getenv("ENABLE_INFRA_ON_STARTUP", "false").lower() == "true"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
