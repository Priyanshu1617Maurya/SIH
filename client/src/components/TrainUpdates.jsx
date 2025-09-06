import React, { useEffect, useState } from "react";
import useWebSocket from "../hooks/useWebSocket";

export default function TrainUpdates() {
  const { status, messages } = useWebSocket("ws://localhost:8000/ws/trains");
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    if (messages.length > 0) {
      const latest = messages[messages.length - 1];
      if (latest.type === "train_updates" || latest.type === "live_updates") {
        setTrains(latest.trains);
      }
    }
  }, [messages]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">
        🚆 Train Live Updates ({status})
      </h2>

      {trains.length === 0 ? (
        <p>No train data yet...</p>
      ) : (
        <ul className="space-y-2">
          {trains.map((train) => (
            <li
              key={train.train_number}
              className="p-2 border rounded bg-gray-100"
            >
              <strong>{train.train_name}</strong> ({train.train_number})<br />
              Status: {train.current_status} | Delay: {train.delay} min<br />
              Next: {train.next_station} ETA {train.eta_next_station}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
