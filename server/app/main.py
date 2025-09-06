from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.routers import trains
from app.utils.websocket import manager
import asyncio
import uvicorn
from app.routers import controller

# Create the FastAPI app
app = FastAPI(title="TrackMitra API")

# Include routers
app.include_router(controller.router, prefix="/api/controller", tags=["controller"])
app.include_router(trains.router, prefix="/api/trains", tags=["trains"])

try:
    from app.routers import ai
    app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
except ImportError as e:
    print(f"Warning: AI router not available - {e}")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "TrackMitra API Server is running!"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Server is running properly"}

# WebSocket endpoint for trains
@app.websocket("/ws/trains")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("Client disconnected")

# Startup event to start train simulation
@app.on_event("startup")
async def startup_event():
    from app.utils.api_client import MOCK_TRAINS_DB
    
    # Load 50-train dataset
    manager.train_data = MOCK_TRAINS_DB.copy()
    
    # Start simulation task
    asyncio.create_task(manager.simulate_real_time_updates())

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
