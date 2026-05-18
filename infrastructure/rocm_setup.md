# AMD ROCm & vLLM Setup Guide

DevPilot is designed to leverage AMD hardware for high-performance LLM inference. Follow these steps to set up your ROCm environment.

## 1. Prerequisites
- AMD GPU (Navi 3x or Instinct series recommended)
- ROCm 6.0+ installed on the host
- Docker with ROCm support (`amdgpu` driver)

## 2. Running vLLM with ROCm
Use the provided Docker profile to spin up a vLLM server optimized for AMD:

```bash
docker run -it \
   --device=/dev/kfd --device=/dev/dri \
   --group-add video \
   --shm-size 1g \
   -p 8000:8000 \
   vllm/vllm-openai:latest \
   --model Qwen/Qwen2.5-7B-Instruct \
   --device rocm
```

## 3. Environment Variables
Update your `.env` or Docker environment:
- `MODEL_API_BASE`: `http://localhost:8000/v1`
- `MODEL_NAME`: `Qwen2.5-7B-Instruct`

## 4. Performance Tuning
For large-scale project generation, consider using **Flash Attention** compatible with ROCm to speed up inference times for long PRDs.
