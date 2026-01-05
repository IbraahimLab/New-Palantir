# Mini Gotham Setup & Run Guide

To see the current progress (Phases 1-6), follow these steps to start the Backend and Frontend.

## 1. Backend Setup
The backend is a FastAPI application integrated with Neo4j and Supabase.

1.  **Navigate to backend**:
    ```powershell
    cd backend
    ```
2.  **Ensure .env is configured**:
    Ensure you have a `.env` file in the `backend/` directory with the following (copy from `.env.example` if needed):
    - `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`
    - `SUPABASE_URL`, `SUPABASE_KEY`
3.  **Run the Backend**:
    ```powershell
    python main.py
    ```
    *The API will be available at `http://localhost:8000`.*

---

## 2. Frontend Setup
The frontend is a React + Vite application.

1.  **Navigate to frontend**:
    ```powershell
    cd frontend
    ```
2.  **Install dependencies**:
    ```powershell
    npm install
    ```
3.  **Create .env file**:
    Create a file named `.env` in the `frontend/` directory and add:
    ```env
     VITE_API_BASE_URL=http://localhost:8000/api/v1
    ```
4.  **Run the Frontend**:
    ```powershell
    npm run dev
    ```
    *The app will be available at `http://localhost:5173`.*

---

## 3. Viewing the Progress
1.  Open `http://localhost:5173` in your browser.
2.  Use the **Knowledge Graph** tab to search for entities (try "Ayaan" or "+252611111111").
3.  Explore the **Investigations** tab to see the Case Management workspace.
4.  Try the **Map**, **Timeline**, **Comms**, and **Finance** views after selecting an entity.

---
> [!NOTE]
> Ensure your Neo4j instance is running and accessible as configured in the backend `.env`.
