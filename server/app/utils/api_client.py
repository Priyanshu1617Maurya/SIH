import aiohttp
import os
from typing import List, Dict, Any
import logging
import asyncio

logger = logging.getLogger(__name__)

# ✅ Mock train data for testing / realistic simulation
# app/utils/api_client.py

MOCK_TRAINS_DB = [
    # North India (12 trains)
    {"train_number": "12301", "train_name": "Rajdhani Express", "current_station": "NDLS", "destination_station": "BCT", "current_status": "Running", "delay": 10, "speed": 80, "lat": 28.6139, "lng": 77.2090, "next_station": "GZB", "eta_next_station": "14:30","type": "train"},
    {"train_number": "12302", "train_name": "Shatabdi Express", "current_station": "NDLS", "destination_station": "LKO", "current_status": "Running", "delay": 5, "speed": 85, "lat": 28.6139, "lng": 77.2090, "next_station": "GTB", "eta_next_station": "13:45"},
    {"train_number": "12303", "train_name": "Kalka Shatabdi", "current_station": "NDLS", "destination_station": "KLK", "current_status": "Running", "delay": 8, "speed": 82, "lat": 28.6139, "lng": 77.2090, "next_station": "PNP", "eta_next_station": "11:20"},
    {"train_number": "12304", "train_name": "Amritsar Shatabdi", "current_station": "NDLS", "destination_station": "ASR", "current_status": "Running", "delay": 12, "speed": 78, "lat": 28.6139, "lng": 77.2090, "next_station": "LDH", "eta_next_station": "12:45"},
    {"train_number": "12305", "train_name": "Dehradun Express", "current_station": "NDLS", "destination_station": "DDN", "current_status": "Running", "delay": 15, "speed": 75, "lat": 28.6139, "lng": 77.2090, "next_station": "MTC", "eta_next_station": "13:15"},
    {"train_number": "12306", "train_name": "Jammu Rajdhani", "current_station": "NDLS", "destination_station": "JAT", "current_status": "Running", "delay": 7, "speed": 83, "lat": 28.6139, "lng": 77.2090, "next_station": "UMB", "eta_next_station": "15:30"},
    {"train_number": "12401", "train_name": "Duronto Express", "current_station": "SBC", "destination_station": "NDLS", "current_status": "Running", "delay": 0, "speed": 90, "lat": 12.9716, "lng": 77.5946, "next_station": "BLR", "eta_next_station": "16:00"},
    {"train_number": "12402", "train_name": "Garib Rath", "current_station": "NDLS", "destination_station": "BCT", "current_status": "Running", "delay": 15, "speed": 75, "lat": 28.6139, "lng": 77.2090, "next_station": "AGC", "eta_next_station": "15:10"},
    {"train_number": "12403", "train_name": "Himsagar Express", "current_station": "JAT", "destination_station": "CAPE", "current_status": "Running", "delay": 20, "speed": 70, "lat": 32.7266, "lng": 74.8570, "next_station": "PTK", "eta_next_station": "17:45"},
    {"train_number": "12404", "train_name": "Sarvodaya Express", "current_station": "JAT", "destination_station": "ADI", "current_status": "Running", "delay": 5, "speed": 80, "lat": 32.7266, "lng": 74.8570, "next_station": "BEAS", "eta_next_station": "14:20"},
    {"train_number": "12405", "train_name": "Shalimar Express", "current_station": "DLI", "destination_station": "SDAH", "current_status": "Running", "delay": 10, "speed": 78, "lat": 28.6517, "lng": 77.2219, "next_station": "CNB", "eta_next_station": "16:30"},
    {"train_number": "12406", "train_name": "Kashmir Express", "current_station": "DLI", "destination_station": "JAT", "current_status": "Running", "delay": 25, "speed": 72, "lat": 28.6517, "lng": 77.2219, "next_station": "UMB", "eta_next_station": "18:15"},

    # East India (10 trains)
    {"train_number": "12501", "train_name": "Howrah Express", "current_station": "HWH", "destination_station": "NDLS", "current_status": "Running", "delay": 8, "speed": 78, "lat": 22.5726, "lng": 88.3639, "next_station": "MGS", "eta_next_station": "12:50"},
    {"train_number": "12502", "train_name": "Sealdah Rajdhani", "current_station": "SDAH", "destination_station": "NDLS", "current_status": "Running", "delay": 12, "speed": 82, "lat": 22.5726, "lng": 88.3639, "next_station": "BJU", "eta_next_station": "13:30"},
    {"train_number": "12503", "train_name": "Poorva Express", "current_station": "HWH", "destination_station": "NDLS", "current_status": "Running", "delay": 15, "speed": 76, "lat": 22.5726, "lng": 88.3639, "next_station": "DGR", "eta_next_station": "14:10"},
    {"train_number": "12504", "train_name": "Gaya Express", "current_station": "HWH", "destination_station": "GAYA", "current_status": "Running", "delay": 5, "speed": 80, "lat": 22.5726, "lng": 88.3639, "next_station": "BWN", "eta_next_station": "13:45"},
    {"train_number": "12505", "train_name": "Bhubaneswar Rajdhani", "current_station": "BBS", "destination_station": "NDLS", "current_status": "Running", "delay": 10, "speed": 85, "lat": 20.2961, "lng": 85.8245, "next_station": "KUR", "eta_next_station": "15:20"},
    {"train_number": "12506", "train_name": "Patna Express", "current_station": "HWH", "destination_station": "PNBE", "current_status": "Running", "delay": 20, "speed": 74, "lat": 22.5726, "lng": 88.3639, "next_station": "BWN", "eta_next_station": "16:30"},
    {"train_number": "12507", "train_name": "Guwahati Express", "current_station": "HWH", "destination_station": "GHY", "current_status": "Running", "delay": 30, "speed": 68, "lat": 22.5726, "lng": 88.3639, "next_station": "MLDT", "eta_next_station": "17:45"},
    {"train_number": "12508", "train_name": "Ranchi Rajdhani", "current_station": "RNC", "destination_station": "NDLS", "current_status": "Running", "delay": 8, "speed": 82, "lat": 23.3441, "lng": 85.3096, "next_station": "BKSC", "eta_next_station": "14:50"},
    {"train_number": "12509", "train_name": "Doon Express", "current_station": "DDU", "destination_station": "DDN", "current_status": "Running", "delay": 12, "speed": 75, "lat": 25.6714, "lng": 85.0419, "next_station": "MZP", "eta_next_station": "15:35"},
    {"train_number": "12510", "train_name": "Mithila Express", "current_station": "RXL", "destination_station": "NDLS", "current_status": "Running", "delay": 18, "speed": 72, "lat": 26.7499, "lng": 84.9018, "next_station": "BUI", "eta_next_station": "16:20"},

    # West India (10 trains)
    {"train_number": "12601", "train_name": "Mumbai Rajdhani", "current_station": "BCT", "destination_station": "NDLS", "current_status": "Running", "delay": 5, "speed": 90, "lat": 19.0760, "lng": 72.8777, "next_station": "ST", "eta_next_station": "14:20"},
    {"train_number": "12602", "train_name": "Mumbai Shatabdi", "current_station": "BCT", "destination_station": "SBC", "current_status": "Running", "delay": 7, "speed": 85, "lat": 19.0760, "lng": 72.8777, "next_station": "PUNE", "eta_next_station": "12:45"},
    {"train_number": "12603", "train_name": "August Kranti Rajdhani", "current_station": "BCT", "destination_station": "NDLS", "current_status": "Running", "delay": 10, "speed": 88, "lat": 19.0760, "lng": 72.8777, "next_station": "BRC", "eta_next_station": "13:30"},
    {"train_number": "12604", "train_name": "Pune Shatabdi", "current_station": "PUNE", "destination_station": "NDLS", "current_status": "Running", "delay": 3, "speed": 86, "lat": 18.5204, "lng": 73.8567, "next_station": "BPL", "eta_next_station": "15:15"},
    {"train_number": "12605", "train_name": "Ahmedabad Express", "current_station": "BCT", "destination_station": "ADI", "current_status": "Running", "delay": 15, "speed": 78, "lat": 19.0760, "lng": 72.8777, "next_station": "VAPI", "eta_next_station": "16:40"},
    {"train_number": "12606", "train_name": "Saurashtra Express", "current_station": "BCT", "destination_station": "BVC", "current_status": "Running", "delay": 20, "speed": 72, "lat": 19.0760, "lng": 72.8777, "next_station": "VRL", "eta_next_station": "17:25"},
    {"train_number": "12607", "train_name": "Goa Express", "current_station": "VSG", "destination_station": "LTT", "current_status": "Running", "delay": 25, "speed": 70, "lat": 15.2993, "lng": 74.1240, "next_station": "MAO", "eta_next_station": "18:10"},
    {"train_number": "12608", "train_name": "Jodhpur Express", "current_station": "BCT", "destination_station": "JU", "current_status": "Running", "delay": 8, "speed": 80, "lat": 19.0760, "lng": 72.8777, "next_station": "ABR", "eta_next_station": "19:05"},
    {"train_number": "12609", "train_name": "Nagpur Express", "current_station": "NGP", "destination_station": "BCT", "current_status": "Running", "delay": 12, "speed": 76, "lat": 21.1458, "lng": 79.0882, "next_station": "BSL", "eta_next_station": "20:15"},
    {"train_number": "12610", "train_name": "Indore Express", "current_station": "INDB", "destination_station": "BCT", "current_status": "Running", "delay": 5, "speed": 82, "lat": 22.7196, "lng": 75.8577, "next_station": "KNW", "eta_next_station": "21:30"},

    # South India (10 trains)
    {"train_number": "12701", "train_name": "Chennai Rajdhani", "current_station": "MAS", "destination_station": "NDLS", "current_status": "Running", "delay": 3, "speed": 88, "lat": 13.0827, "lng": 80.2707, "next_station": "BZA", "eta_next_station": "15:10"},
    {"train_number": "12702", "train_name": "Chennai Shatabdi", "current_station": "MAS", "destination_station": "BCT", "current_status": "Running", "delay": 6, "speed": 80, "lat": 13.0827, "lng": 80.2707, "next_station": "VSKP", "eta_next_station": "16:20"},
    {"train_number": "12703", "train_name": "Bangalore Rajdhani", "current_station": "SBC", "destination_station": "NDLS", "current_status": "Running", "delay": 8, "speed": 87, "lat": 12.9716, "lng": 77.5946, "next_station": "GY", "eta_next_station": "14:45"},
    {"train_number": "12704", "train_name": "Hyderabad Express", "current_station": "SC", "destination_station": "MAS", "current_status": "Running", "delay": 10, "speed": 79, "lat": 17.3850, "lng": 78.4867, "next_station": "BZA", "eta_next_station": "16:55"},
    {"train_number": "12705", "train_name": "Kochuveli Express", "current_station": "KCVL", "destination_station": "NDLS", "current_status": "Running", "delay": 15, "speed": 75, "lat": 8.5241, "lng": 76.9366, "next_station": "QLN", "eta_next_station": "17:40"},
    {"train_number": "12706", "train_name": "Kanyakumari Express", "current_station": "CAPE", "destination_station": "MAS", "current_status": "Running", "delay": 20, "speed": 72, "lat": 8.0883, "lng": 77.5385, "next_station": "TEN", "eta_next_station": "18:25"},
    {"train_number": "12707", "train_name": "Coimbatore Express", "current_station": "CBE", "destination_station": "MAS", "current_status": "Running", "delay": 5, "speed": 81, "lat": 11.0168, "lng": 76.9558, "next_station": "TUP", "eta_next_station": "19:10"},
    {"train_number": "12708", "train_name": "Mysore Shatabdi", "current_station": "MYS", "destination_station": "SBC", "current_status": "Running", "delay": 2, "speed": 84, "lat": 12.2958, "lng": 76.6394, "next_station": "KGI", "eta_next_station": "20:05"},
    {"train_number": "12709", "train_name": "Vizag Express", "current_station": "VSKP", "destination_station": "SC", "current_status": "Running", "delay": 12, "speed": 77, "lat": 17.6868, "lng": 83.2185, "next_station": "RJY", "eta_next_station": "21:15"},
    {"train_number": "12710", "train_name": "Trivandrum Express", "current_station": "TVC", "destination_station": "NDLS", "current_status": "Running", "delay": 8, "speed": 80, "lat": 8.5241, "lng": 76.9366, "next_station": "ERS", "eta_next_station": "22:00"},

    # Central & North-East India (8 trains)
    {"train_number": "12801", "train_name": "Bhopal Express", "current_station": "BPL", "destination_station": "NDLS", "current_status": "Running", "delay": 7, "speed": 82, "lat": 23.2599, "lng": 77.4126, "next_station": "JHS", "eta_next_station": "14:25"},
    {"train_number": "12802", "train_name": "Jabalpur Express", "current_station": "JBP", "destination_station": "NDLS", "current_status": "Running", "delay": 10, "speed": 78, "lat": 23.1815, "lng": 79.9864, "next_station": "ET", "eta_next_station": "15:40"},
    {"train_number": "12803", "train_name": "Raipur Express", "current_station": "R", "destination_station": "NDLS", "current_status": "Running", "delay": 15, "speed": 75, "lat": 21.2514, "lng": 81.6296, "next_station": "DURG", "eta_next_station": "16:55"},
    {"train_number": "12804", "train_name": "Bilaspur Express", "current_station": "BSP", "destination_station": "NDLS", "current_status": "Running", "delay": 5, "speed": 80, "lat": 22.0800, "lng": 82.1590, "next_station": "R", "eta_next_station": "17:30"},
    {"train_number": "12805", "train_name": "Guwahati Rajdhani", "current_station": "GHY", "destination_station": "NDLS", "current_status": "Running", "delay": 20, "speed": 85, "lat": 26.1445, "lng": 91.7362, "next_station": "NBQ", "eta_next_station": "18:45"},
    {"train_number": "12806", "train_name": "Agartala Express", "current_station": "AGTL", "destination_station": "NDLS", "current_status": "Running", "delay": 25, "speed": 70, "lat": 23.8315, "lng": 91.2868, "next_station": "DMR", "eta_next_station": "19:20"},
    {"train_number": "12807", "train_name": "Imphal Express", "current_station": "IMF", "destination_station": "NDLS", "current_status": "Running", "delay": 30, "speed": 65, "lat": 24.8170, "lng": 93.9368, "next_station": "DPR", "eta_next_station": "20:10"},
    {"train_number": "12808", "train_name": "Shillong Express", "current_station": "GHY", "destination_station": "SGUJ", "current_status": "Running", "delay": 12, "speed": 68, "lat": 26.1445, "lng": 91.7362, "next_station": "NBQ", "eta_next_station": "21:05"}
]

# RapidAPI credentials (environment variables fallback)
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "YOUR_DEFAULT_KEY")
RAPIDAPI_HOST = os.getenv("RAPIDAPI_HOST", "train-running-api.p.rapidapi.com")

async def fetch_train_data(query: str = "", search_type: str = "") -> List[Dict[str, Any]]:
    """
    Returns multiple train APIs config
    """
    RAILWAY_APIS = [
        {
            "name": "Indian Railway API",
            "url": "https://indianrailways.p.rapidapi.com/index.php",
            "headers": {
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": "indianrailways.p.rapidapi.com"
            }
        },
        {
            "name": "Train Info API", 
            "url": "https://train-info.p.rapidapi.com/api/train",
            "headers": {
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": "train-info.p.rapidapi.com"
            }
        }
    ]
    return RAILWAY_APIS


async def fetch_live_train_status(train_number: str) -> List[Dict[str, Any]]:
    """
    Fetch live train status from multiple APIs asynchronously.
    Falls back to MOCK_TRAINS_DB if APIs fail.
    """
    apis = await fetch_train_data()
    
    for api in apis:
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    api["url"], 
                    headers=api["headers"],
                    params={"trainno": train_number}
                ) as response:
                    
                    if response.status == 200:
                        data = await response.json()
                        return [parse_live_train_data(data)]
        except Exception as e:
            logger.error(f"{api['name']} error: {str(e)}")
            continue
    
    # ✅ fallback to mock data if API fails
    mock_result = [train for train in MOCK_TRAINS_DB if train["train_number"] == train_number]
    return mock_result if mock_result else []


def parse_live_train_data(api_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize different API responses into a single format.
    """
    # API 1 format
    if "trainNo" in api_data:
        return {
            "train_number": api_data.get("trainNo"),
            "train_name": api_data.get("trainName"),
            "current_status": api_data.get("status"),
            "delay": api_data.get("delayMin", 0),
            "speed": api_data.get("speed", 0),
            "lat": api_data.get("lat"),
            "lng": api_data.get("lng"),
            "next_station": api_data.get("nextStation"),
            "eta_next_station": api_data.get("eta"),
            "last_update": api_data.get("timestamp")
        }
    
    # API 2 format
    elif "train_number" in api_data:
        return {
            "train_number": api_data.get("train_number"),
            "train_name": api_data.get("train_name"),
            "current_status": api_data.get("current_status"),
            "delay": api_data.get("delay_minutes", 0),
            "speed": api_data.get("current_speed", 0),
            "lat": api_data.get("latitude"),
            "lng": api_data.get("longitude"),
            "next_station": api_data.get("next_station"),
            "eta_next_station": api_data.get("eta_next_station"),
            "last_update": api_data.get("last_updated")
        }
    
    return {}  # fallback


# ✅ Explicit exports
__all__ = [
    "MOCK_TRAINS_DB",
    "fetch_train_data",
    "fetch_live_train_status",
    "parse_live_train_data",
]
