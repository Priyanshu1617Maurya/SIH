import os
import httpx
from typing import List, Dict, Any, Optional
from .base import TrainProvider

BASE = os.getenv("COMMUNITY_API_BASE", "").rstrip("/")
API_KEY = os.getenv("COMMUNITY_API_KEY", "")

class CommunityProvider(TrainProvider):
    """
    Adapter for a community-provided train API.
    The exact payload/endpoint varies by provider — adapt this code to the provider you choose.
    """

    async def get_live_trains(self, bbox: Optional[list]=None) -> List[Dict[str, Any]]:
        if not BASE:
            return []
        params = {}
        if bbox:
            params["bbox"] = ",".join(map(str, bbox))
        headers = {"Authorization": API_KEY} if API_KEY else {}
        async with httpx.AsyncClient(timeout=15) as client:
            r = await client.get(f"{BASE}/live-trains", params=params, headers=headers)
            r.raise_for_status()
            data = r.json()
        # Expecting a list of train dicts with lat/lng fields
        return data

    async def simulate(self, params: Dict[str, Any]) -> Dict[str, Any]:
        # If community provider supports simulation, use it; otherwise return a simple response
        if not BASE:
            return {
                "message": "Community provider not configured",
                "impact": "N/A",
                "optimizedSchedule": []
            }
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.post(f"{BASE}/simulate", json=params)
            r.raise_for_status()
            return r.json()
