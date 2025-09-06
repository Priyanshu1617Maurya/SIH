from fastapi import WebSocket
from typing import List
import asyncio
import random
from datetime import datetime
from app.utils.api_client import fetch_live_train_status

# Helper: Boundaries for India lat/lng
INDIA_LAT_RANGE = (6.0, 37.0)
INDIA_LNG_RANGE = (68.0, 97.0)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.train_data: List[dict] = []

    async def connect(self, websocket: WebSocket):
        self.active_connections.append(websocket)
        print(f"New connection. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"Connection removed. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        """Send JSON to all connected clients"""
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error broadcasting message: {e}")
                self.disconnect(connection)

    async def simulate_real_time_updates(self):
        """Continuously update train positions and delays"""
        while True:
            if self.active_connections:
                for train in self.train_data:
                    # Randomize movement
                    train["lat"] += random.uniform(-0.05, 0.05)
                    train["lng"] += random.uniform(-0.05, 0.05)
                    
                    # Clamp coordinates within India
                    train["lat"] = max(min(train["lat"], INDIA_LAT_RANGE[1]), INDIA_LAT_RANGE[0])
                    train["lng"] = max(min(train["lng"], INDIA_LNG_RANGE[1]), INDIA_LNG_RANGE[0])
                    
                    # Random delay updates
                    if random.random() < 0.2:
                        train["delay"] = max(0, train.get("delay", 0) + random.randint(-5, 15))
                    
                    # Status
                    train["current_status"] = "Delayed" if train.get("delay", 0) > 30 else "Running"

                # Broadcast updates to all clients
                await self.broadcast({
                    "type": "train_updates",
                    "trains": self.train_data,
                    "timestamp": datetime.now().isoformat()
                })

            await asyncio.sleep(5)  # update every 5 seconds

# Global manager
manager = ConnectionManager()
