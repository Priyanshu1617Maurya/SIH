from fastapi import APIRouter, HTTPException
from typing import List
import datetime

router = APIRouter()

# Mock data for demonstration
mock_trains = [
    {
        "train_number": "12345",
        "train_name": "Rajdhani Express",
        "current_station": "NDLS",
        "destination_station": "CNB",
        "current_status": "Running",
        "delay": 15,
        "speed": 75,
        "lat": 28.6139,
        "lng": 77.2090,
        "next_station": "GZB",
        "eta_next_station": "14:30",
        "origin_station_name": "New Delhi",
        "destination_station_name": "Kanpur Central",
        "next_station_name": "Ghaziabad"
    },
    # Add more mock trains...
]

@router.get("/all")
async def get_all_trains():
    return mock_trains

@router.post("/command")
async def send_control_command(command: dict):
    # In real implementation, this would send commands to actual train systems
    print(f"Received command: {command}")
    return {"status": "success", "message": "Command received"}

@router.post("/alerts/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    return {"status": "success", "message": "Alert acknowledged"}