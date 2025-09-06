from fastapi import APIRouter, HTTPException, Query
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Simple mock data
MOCK_TRAINS = [
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
    {
        "train_number": "12839",
        "train_name": "Howrah Rajdhani",
        "current_station": "NDLS",
        "destination_station": "HWH",
        "current_status": "Running",
        "delay": 8,
        "speed": 82,
        "lat": 28.6239,
        "lng": 77.2190,
        "next_station": "CNB",
        "eta_next_station": "15:45",
        "origin_station_name": "New Delhi",
        "destination_station_name": "Howrah",
        "next_station_name": "Kanpur Central"
    }
]

@router.get("/search")
async def search_trains(
    q: str = Query(..., description="Search query"),
    type: str = Query("number", description="Search type: number, name, or station")
):
    try:
        print(f"Searching for: {q} with type: {type}")
        
        if type == "number":
            trains = [train for train in MOCK_TRAINS if q in train["train_number"]]
        elif type == "name":
            trains = [train for train in MOCK_TRAINS if q.lower() in train["train_name"].lower()]
        elif type == "station":
            trains = [train for train in MOCK_TRAINS 
                     if q.upper() in [train["current_station"], train["destination_station"], train["next_station"]]]
        else:
            trains = []
        
        return trains
        
    except Exception as e:
        logger.error(f"Error searching trains: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{train_number}")
async def get_train_by_number(train_number: str):
    try:
        train = next((t for t in MOCK_TRAINS if t["train_number"] == train_number), None)
        
        if not train:
            raise HTTPException(status_code=404, detail="Train not found")
        
        return train
        
    except Exception as e:
        logger.error(f"Error fetching train {train_number}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")