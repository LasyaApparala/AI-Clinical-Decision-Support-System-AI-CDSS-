from fastapi import APIRouter
from pydantic import BaseModel
from rag.rag_pipeline import rag_answer

router = APIRouter()

class ProcessReq(BaseModel):
    sessionId: str
    message: str
    userId: str | None = None
    mode: str | None = None
    temperature: float | None = 0.1
    topK: int | None = None

@router.post("/process")
def process(req: ProcessReq):
    result = rag_answer(req.message, top_k=req.topK, temperature=req.temperature or 0.1)
    return result
