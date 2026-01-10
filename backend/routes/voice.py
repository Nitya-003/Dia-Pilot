from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from datetime import datetime

from database import get_db
from models import VoiceLog
from schemas import VoiceCommandRequest, VoiceCommandResponse
from services.voice_processor import voice_processor

router = APIRouter(prefix="/api/voice", tags=["voice"])


@router.post("/command", response_model=VoiceCommandResponse)
async def process_voice_command(
    request: VoiceCommandRequest,
    db: Session = Depends(get_db)
):
    """
    Process voice command and extract structured data.
    """
    try:
        # Process the command
        intent, extracted_data, message = voice_processor.process_command(
            request.transcript
        )
        
        # Save to database
        voice_log = VoiceLog(
            transcript=request.transcript,
            intent=intent,
            extracted_data=json.dumps(extracted_data) if extracted_data else None,
            created_at=datetime.utcnow()
        )
        db.add(voice_log)
        db.commit()
        
        return VoiceCommandResponse(
            intent=intent,
            extracted_data=extracted_data,
            message=message,
            success=True
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing voice command: {str(e)}"
        )
