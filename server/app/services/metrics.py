from typing import List, Dict, Any

def compute_metrics(trains: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not trains:
        return {"totalTrains": 0, "avgDelayReduced": 0, "energySaved": 0, "throughput": [], "delaySeries": []}
    total = len(trains)
    avg_delay = sum(t.get("delay_min", 0) for t in trains) / max(1, total)
    energy_saved = round(max(0, 25 - avg_delay) / 100 * 20, 1)   # fake %
    throughput = [120, 135, 150, 162]
    delaySeries = [25, 20, 18, 16, 12, 10, max(8, int(avg_delay))]
    return {
        "totalTrains": total,
        "avgDelayReduced": round(max(0, 35 - avg_delay), 1),  # %
        "energySaved": energy_saved,
        "throughput": throughput,
        "delaySeries": delaySeries,
    }
