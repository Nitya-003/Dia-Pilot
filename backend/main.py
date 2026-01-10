from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from config import settings
from database import init_db
from routes.meals import router as meals_router
from routes.glucose import router as glucose_router
from routes.predictions import router as predictions_router
from routes.voice import router as voice_router
from routes.behavioral import router as behavioral_router
from routes.clinician import router as clinician_router

# Initialize FastAPI app
app = FastAPI(
    title="Dia-Pilot API",
    description="Backend API for Dia-Pilot diabetes management platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(meals_router)
app.include_router(glucose_router)
app.include_router(predictions_router)
app.include_router(voice_router)
app.include_router(behavioral_router)
app.include_router(clinician_router)

# Serve uploaded files
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print("Database initialized!")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Dia-Pilot API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
