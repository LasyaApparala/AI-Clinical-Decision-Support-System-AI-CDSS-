import os, json
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import requests

_pipe = None

def _get_local_pipe():
    global _pipe
    if _pipe is None:
        model_name = os.getenv("HF_LOCAL_MODEL","google/flan-t5-large")
        tok = AutoTokenizer.from_pretrained(model_name)
        mdl = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        _pipe = pipeline("text2text-generation", model=mdl, tokenizer=tok)
    return _pipe

def _hf_inference(prompt: str) -> str:
    url = os.getenv("HF_INFERENCE_API_URL")
    token = os.getenv("HF_INFERENCE_API_TOKEN")
    r = requests.post(url, headers={"Authorization": f"Bearer {token}"}, json={"inputs": prompt}, timeout=120)
    r.raise_for_status()
    j = r.json()
    if isinstance(j, list) and j and "generated_text" in j[0]:
        return j[0]["generated_text"]
    return str(j)

def _openai(prompt: str) -> str:
    import openai, os
    openai.api_key = os.getenv("OPENAI_API_KEY")
    # gpt-4o-mini or similar; keep it generic
    resp = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role":"system","content":"You are a clinical assistant."},{"role":"user","content":prompt}],
        temperature=0.1
    )
    return resp.choices[0].message["content"]

def generate(prompt: str, temperature: float = 0.1) -> str:
    backend = os.getenv("LLM_BACKEND","local")
    if backend == "hf_inference": return _hf_inference(prompt)
    if backend == "openai": return _openai(prompt)
    pipe = _get_local_pipe()
    out = pipe(prompt, max_new_tokens=512, do_sample=False)
    return out[0]["generated_text"]
