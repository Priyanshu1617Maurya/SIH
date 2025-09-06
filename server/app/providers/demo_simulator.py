import json, time, random
from pathlib import Path
from typing import List, Dict, Any, Optional
from .base import TrainProvider

# locate data dir: app/providers -> go up one to app, then data
DATA_DIR = Path(__file__).resolve().parents[1] / "data"
STATIONS_FILE = DATA_DIR / "stations.json"
SAMPLE_TRAINS_FILE = DATA_DIR / "sample_trains.json"

STATIONS = {}
SEED_TRAINS = []

try:
    STATIONS = json.loads(STATIONS_FILE.read_text(encoding="utf-8"))
except Exception:
    STATIONS = {}

try:
    SEED_TRAINS = json.loads(SAMPLE_TRAINS_FILE.read_text(encoding="utf-8"))
except Exception:
    SEED_TRAINS = []

def lerp(a, b, t): return a + (b - a) * t

class DemoSimulator(TrainProvider):
    """
    Moves trains along routes between known station coords at plausible speeds.
    Returns lat/lng, delay, speed, last_update.
    """

    def __init__(self):
        self.routes = []
        for tr in SEED_TRAINS:
            coords = []
            for code in tr.get("stations", []):
                st = STATIONS.get(code)
                if st:
                    coords.append((st["lng"], st["lat"]))
            if len(coords) >= 2:
                self.routes.append({
                    "number": tr.get("number"),
                    "name": tr.get("name"),
                    "path": coords,
                    "base_speed": random.randint(60, 90),
                    "delay_min": random.choice([0,5,10,15,20]),
                    "start_ts": time.time() - random.randint(0, 3600),
                })

    async def get_live_trains(self, bbox: Optional[list]=None) -> List[Dict[str, Any]]:
        out = []
        now = time.time()
        for r in self.routes:
            # progress 0..1 over ~2 hour loop
            progress = ((now - r["start_ts"]) / 7200.0) % 1.0
            total = len(r["path"]) - 1
            seg_f = progress * total
            i = int(seg_f)
            # clamp
            if i >= total:
                i = total - 1
                t = 1.0
            else:
                t = seg_f - i
            a = r["path"][i]
            b = r["path"][i+1]
            lng = lerp(a[0], b[0], t)
            lat = lerp(a[1], b[1], t)
            speed = r["base_speed"] + random.uniform(-5, 5)
            train = {
                "number": r["number"],
                "name": r["name"],
                "lat": lat,
                "lng": lng,
                "speed_kmph": round(speed, 1),
                "delay_min": r["delay_min"],
                "last_update": int(now)
            }
            if bbox:
                minLng, minLat, maxLng, maxLat = bbox
                if not (minLng <= lng <= maxLng and minLat <= lat <= maxLat):
                    continue
            out.append(train)
        return out

    async def simulate(self, params: Dict[str, Any]) -> Dict[str, Any]:
        trains = int(params.get("numberOfTrains", 10) or 10)
        delay = int(params.get("delayMinutes", 5) or 5)
        reduced = max(0, int(delay * 0.7))
        return {
            "message": "Simulation Complete (Demo Simulator)",
            "impact": f"Reduced delay by {delay - reduced} mins (~30%)",
            "optimizedSchedule": [
                {"train": f"Train {100+i}", "newETA": f"{10+i}:{15+(i*3)%60:02d}"} for i in range(min(5, trains))
            ],
        }
