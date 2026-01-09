# Dia-Pilot Backend

Python FastAPI backend for the Dia-Pilot diabetes management platform.

## Features

- **Snap & Sync**: Upload meal photos and get carbohydrate estimates
- RESTful API with automatic documentation
- SQLite database for meal logging
- Image processing and validation

## Setup

### Prerequisites

- Python 3.8 or higher
- pip

### Installation

1. **Create virtual environment**:
   ```bash
   python -m venv venv
   ```

2. **Activate virtual environment**:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

5. **Initialize database**:
   ```bash
   python database.py
   ```

## Running the Server

Start the development server:
```bash
uvicorn main:app --reload --port 8000
```

Or use Python directly:
```bash
python main.py
```

The API will be available at:
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

## API Endpoints

### Meals

- `POST /api/meals/snap` - Upload meal photo
  - Accepts: multipart/form-data with image file
  - Returns: Carbohydrate estimate and meal metadata

- `GET /api/meals/history` - Get recent meal logs
  - Query params: `limit` (default: 10)
  - Returns: List of meal logs

- `GET /api/meals/{meal_id}` - Get specific meal
  - Returns: Meal details

### Health

- `GET /` - Root endpoint
- `GET /health` - Health check

## Project Structure

```
backend/
├── main.py              # FastAPI application
├── config.py            # Configuration settings
├── database.py          # Database setup
├── models.py            # SQLAlchemy models
├── schemas.py           # Pydantic schemas
├── routes/
│   └── meals.py         # Meal endpoints
├── services/
│   └── meal_analyzer.py # Meal analysis service
├── uploads/             # Uploaded images
└── requirements.txt     # Python dependencies
```

## Development

The meal analyzer currently uses simple heuristics for carbohydrate estimation. In production, this should be replaced with a trained computer vision model (e.g., using TensorFlow or PyTorch).

## CORS Configuration

The backend is configured to accept requests from:
- http://localhost:5173 (Vite dev server)
- http://localhost:3000
- http://127.0.0.1:5173

Update `config.py` to add additional origins if needed.
