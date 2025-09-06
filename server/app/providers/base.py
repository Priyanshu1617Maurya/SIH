from typing import List, Dict, Any, Optional
from abc import ABC, abstractmethod

class TrainProvider(ABC):
    @abstractmethod
    async def get_live_trains(self, bbox: Optional[list]=None) -> List[Dict[str, Any]]:
        """
        Return list of trains, each as:
        { number, name, lat, lng, speed_kmph, delay_min, last_update }
        """
        ...

    @abstractmethod
    async def simulate(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Run a simulation given params and return:
        { message, impact, optimizedSchedule: [...] }
        """
        ...
