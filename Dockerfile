FROM python:3.11-slim

WORKDIR /app

# Copy requirements from backend folder
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend and shared codebase
COPY backend/ ./backend/
COPY shared/ ./shared/

# Add app root to Python path so shared.schemas can be imported
ENV PYTHONPATH=/app

CMD ["python", "backend/main.py"]
