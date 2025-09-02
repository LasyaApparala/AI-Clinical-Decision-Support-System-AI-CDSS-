from rag.rag_pipeline import rag_answer
def test_rag_no_docs_returns_insufficient(monkeypatch):
    from vectorstore import chroma_store
    def fake_query(q, k): return []
    monkeypatch.setattr(chroma_store, "query", fake_query)
    out = rag_answer("test")
    assert "Insufficient" in out["answer"]
