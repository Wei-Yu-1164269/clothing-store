# Clothing Store -- Full Stack Developer Test

This project is a simple product detail page with cart functionality.

It consists of:

-   **Frontend:** React (Vite)
-   **Backend:** Python (Flask REST API)
-   **Database:** SQLite
-   **Containerisation:** Docker & Docker Compose

------------------------------------------------------------------------

## System Requirements

Please ensure the following is installed:

-   Docker Desktop (latest version)
-   Docker Compose (included with Docker Desktop)

Tested on: - Windows 10 - Docker Desktop with WSL2

------------------------------------------------------------------------

## Run the Application (One Command)

From the project root directory (where `docker-compose.yml` is located),
run:

    docker compose up --build

This command will:

-   Build the backend container
-   Build the frontend container
-   Start both services
-   Automatically connect them via Docker network

------------------------------------------------------------------------

## Access the Application

Frontend:

    http://localhost:5173

Backend API:

    http://localhost:5000

------------------------------------------------------------------------

## Stop the Application

To stop the running containers:

1.  Press:

```{=html}
Ctrl + C
```

2.  Then cleanly shut down containers:

```{=html}
docker compose down
```

------------------------------------------------------------------------

## Rebuild After Code Changes

If Dockerfiles or dependencies change:

    docker compose down
    docker compose up --build

------------------------------------------------------------------------

## Auto Test for Client (Run tests using Docker)

The frontend includes unit tests written using Vitest and React Testing Library.

Test file location: 
```bash
./client/pages/ProductPage.test.tsx
```

From the project root directory (where `docker-compose.yml` is located), run:

```bash
docker compose run --rm web npm run test:run
```


## Project Structure

    .
    ├── backend/
    │   ├── Dockerfile
    │   ├── app.py
    │   └── requirements.txt
    ├── client/
    │   ├── Dockerfile
    │   ├── src/
    │   └── package.json
    ├── scipt/
    │   ├── setup.bat
    │   ├── start.bat
    │   └── stop.bat
    ├── docker-compose.yml
    └── README_Docker.md

------------------------------------------------------------------------

## Notes

-   The frontend consumes product data from the Flask REST API.
-   SQLite database is mounted as a volume for persistence.
-   CORS is enabled in the backend for local development.

------------------------------------------------------------------------


