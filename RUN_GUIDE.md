# Mini Gotham Setup & Run Guide

To see the current progress (Phase 1-7), follow these steps to start the Backend and Frontend.

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

## 3. Viewing the Features (Phase 1-7)
1.  **Search & Graph**: Search for "Ayaan" or "+252611001001". Expand nodes to see the network.
2.  **Analysis Views**: Switch between Timeline, Map, Comms, and Finance views while an entity is selected.
3.  **Role-Based Access**: Use the **Role Switcher** in the header to toggle between *Analyst* and *Investigator*. 
    - Note how PII (Phone, DOB, SSN) is masked in the Detail Panel and Analysis Views when in *Analyst* mode.
4.  **Audit Logs**: Visit the **Audit Logs** tab to see real-time security logs of your actions.
5.  **Notifications**: Observe toast notifications when expanding entities or performing actions.
6.  **Navigation**: Enjoy smooth animations as you switch between views and tabs.

---
> [!NOTE]
> Ensure your Neo4j instance is running and accessible as configured in the backend `.env`.
