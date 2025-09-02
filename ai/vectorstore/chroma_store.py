import os, chromadb
from chromadb.config import Settings

client = chromadb.PersistentClient(path=os.getenv("CHROMA_PERSIST_DIR","./chroma"))
coll = client.get_or_create_collection(name="medical_docs", metadata={"hnsw:space": "cosine"})

def upsert(doc_id: str, chunks: list[dict]):
    ids, docs, metadatas = [], [], []
    for c in chunks:
        ids.append(f"{doc_id}:{c['chunk_id']}")
        docs.append(c["text"])
        metadatas.append({
            "doc_id": doc_id,
            "chunk_id": c["chunk_id"],
            "source": c.get("source",""),
            "url": c.get("url",""),
            "evidence_level": c.get("evidence_level",""),
            "pub_date": c.get("pub_date",""),
        })
    coll.upsert(ids=ids, documents=docs, metadatas=metadatas)

def query(text: str, k: int = 8):
    res = coll.query(query_texts=[text], n_results=k, include=["documents","metadatas","distances"])
    docs = []
    for i in range(len(res["ids"][0])):
        m = res["metadatas"][0][i]
        d = res["documents"][0][i]
        dist = res["distances"][0][i]
        score = 1.0 - dist  # cosine -> similarity
        docs.append({
            "id": f"{m['doc_id']}:{m['chunk_id']}",
            "snippet": d[:300],
            "url": m.get("url",""),
            "source": m.get("source",""),
            "score": score
        })
    return docs
