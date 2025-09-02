import os, json
from vectorstore.chroma_store import query as vs_query
from llm.medical_llm import generate
from rag.prompt_templates import SYSTEM_PROMPT, USER_PROMPT

def build_context(retrieved):
    lines = []
    for i, r in enumerate(retrieved, start=1):
        lines.append(f"[Doc{i}] {r['snippet']}")
    return "\n".join(lines)

def postprocess_answer(raw: str, retrieved):
    # Best-effort ensure JSON; if model outputs text, wrap it
    try:
        j = json.loads(raw)
    except Exception:
        j = { "case_summary": raw[:400], "differential": [], "assessment_plan": raw, "todo": [], "citations": [] }

    sources = []
    for i, r in enumerate(retrieved, start=1):
        sources.append({ "id": f"Doc{i}", "snippet": r["snippet"][:280], "url": r.get("url",""), "score": r.get("score",0.0) })
    return {
        "answer": f"**Case Summary & Plan**\n\n{j.get('case_summary','')}\n\n---\n\n**Assessment & Plan**\n\n{j.get('assessment_plan','')}\n\n---\n\n**To-Do**\n" + "\n".join([f"- {t}" for t in j.get("todo",[])]),
        "citations": sources,
        "tokensUsed": len((j.get('case_summary','') + j.get('assessment_plan','')).split()),
        "meta": { "model": os.getenv("LLM_BACKEND","local") }
    }

def rag_answer(query: str, top_k: int | None = None, temperature: float = 0.1):
    k = top_k or int(os.getenv("RAG_TOP_K","8"))
    retrieved = vs_query(query, k)
    if not retrieved:
        return {
            "answer": 'Insufficient evidence — please provide more information.',
            "citations": [],
            "tokensUsed": 0, "meta": {}
        }
    context = build_context(retrieved)
    prompt = SYSTEM_PROMPT + USER_PROMPT.format(context=context, case_text=query)
    raw = generate(prompt, temperature=temperature)
    return postprocess_answer(raw, retrieved)
