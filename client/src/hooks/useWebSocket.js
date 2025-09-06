import { useEffect, useRef, useState } from "react";

export const useWebSocket = (url) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const connect = () => {
      if (!isMounted) return;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket connected:", url);
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages((prev) => [...prev, data]);
        } catch (error) {
          console.error("❌ Error parsing WS message:", error);
        }
      };

      ws.onclose = () => {
        console.warn("⚠️ WebSocket disconnected:", url);
        setIsConnected(false);

        // Auto reconnect after 3 sec
        reconnectTimer.current = setTimeout(() => {
          console.log("🔄 Reconnecting WebSocket...");
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        ws.close();
      };
    };

    connect();

    return () => {
      isMounted = false;
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, [url]);

  // Optional: send message to server
  const sendMessage = (msg) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(msg));
    }
  };

  return { messages, isConnected, sendMessage };
};
