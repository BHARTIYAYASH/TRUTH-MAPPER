from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
from modules.translator import BridgeTranslator
import uvicorn
import torch

app = FastAPI(title="Argument Cartographer Translation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

translator = BridgeTranslator()

class TranslationRequest(BaseModel):
    text: str
    target_lang: str

class UIContentRequest(BaseModel):
    json_data: Any
    target_lang: str

@app.post("/translate")
async def translate(request: TranslationRequest):
    try:
        translated_text = translator.translate_text(request.text, request.target_lang)
        return {"translated_text": translated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/translate_ui")
async def translate_ui(request: UIContentRequest):
    try:
        translated_json = translator.translate_ui_content(request.json_data, request.target_lang)
        return {"translated_json": translated_json}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok", "use_fallback": translator.use_fallback}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
