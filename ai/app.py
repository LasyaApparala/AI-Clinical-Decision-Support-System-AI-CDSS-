from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv; load_dotenv()
from api.process import router as process_router

app = FastAPI(title="MedAssist AI", version="1.0.0")

@app.get("/health")
def health():
    return {"ok": True}

app.include_router(process_router)

# Global safety: no PHI echoes in logs; exceptions sanitized
@app.exception_handler(Exception)
async def all_ex_handler(request, exc):
    return HTTPException(status_code=500, detail="AI service error")
