import os, re, json, math
from utils.logger import log
from vectorstore.chroma_store import upsert
from embeddings.embedder import get_embedder

RAW_DIR = "data/raw_docs"
def _iter_docs():
    for fn in os.listdir(RAW_DIR):
        p = os.path.join(RAW_DIR, fn)
        if fn.endswith(".txt") or fn.endswith(".md"):
            with open(p, "r", encoding="utf-8") as f: yield {"id": fn, "text": f.read(), "url": "", "source": fn}
        elif fn.endswith(".jsonl"):
            with open(p, "r", encoding="utf-8") as f:
                for line in f:
                    j = json.loads(line)
                    yield {"id": j.get("id") or j.get("url") or fn, "text": j["text"], "url": j.get("url",""), "source": j.get("title", fn)}

def _chunk(text: str, max_tokens: int = 512):
    # naive tokenizer by whitespace; approximate tokens ~ words
    words = text.split()
    size = max_tokens
    step = int(size * 0.8)
    chunks = []
    i = 0; cid = 0
    while i < len(words):
        piece = " ".join(words[i:i+size])
        chunks.append({"chunk_id": cid, "text": piece})
        cid += 1; i += step
    return chunks

def ingest():
    # Force model download so runtime warms up
    get_embedder()
    count_docs = 0; count_chunks = 0
    for doc in _iter_docs():
        chunks = _chunk(doc["text"])
        for c in chunks:
            c.update({"source": doc["source"], "url": doc["url"]})
        upsert(doc["id"], chunks)
        count_docs += 1; count_chunks += len(chunks)
    log(f"Ingested {count_docs} docs -> {count_chunks} chunks")

if __name__ == "__main__":
    ingest()
