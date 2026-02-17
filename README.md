# Clothing Store -- Fullstack Demo

A fullstack clothing store application built with:

-   Backend: Python (Flask)
-   Frontend: React + Vite + TypeScript
-   Database: SQLite
-   Features: Product display, cart management, size selection, admin
    upload

------------------------------------------------------------------------


# 一 Project Structure

    clothing-store/
    │
    ├── backend/        # Python backend
    ├── client/         # React frontend
    ├── scripts/        # One key start scripts(only for windows)
    └── README.md

------------------------------------------------------------------------


# 二 Windows Setup Guide

## 2.1 Clone Repository

``` bash
git clone https://github.com/Wei-Yu-1164269/clothing-store.git
cd clothing-store
```

------------------------------------------------------------------------

## 2.2 Install all dependence

``` bash
cd scripts
setup.bat
```

------------------------------------------------------------------------

## 2.3 start client and backend

``` bash
cd scripts
start.bat
```

Backend runs at: http://localhost:5000
Frontend runs at: http://localhost:5173

------------------------------------------------------------------------

## 2.4 stop client and backend

``` bash
cd scripts
stop.bat
```

------------------------------------------------------------------------


# 三 macOS Setup Guide

## 3.1 Clone Repository

``` bash
git clone https://github.com/Wei-Yu-1164269/clothing-store.git
cd clothing-store
```

------------------------------------------------------------------------

## 3.2 ackend Setup (macOS)

``` bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

Backend runs at: http://localhost:5000

------------------------------------------------------------------------

## 3.3 Frontend Setup (macOS)

Open a new terminal:

``` bash
cd client
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

------------------------------------------------------------------------


# 四 Auto test for client

test file location : .\client\pages\ProductPage.test.tsx

``` bash
cd client
npx vitest
```
------------------------------------------------------------------------

# 五 Requirements

-   Python 3.9+
-   Node.js 18+
-   npm

Check versions:

``` bash
python --version
python3 --version
node -v
npm -v
```

------------------------------------------------------------------------

# 六 Development Notes

-   Backend default port: 5000
-   Frontend default port: 5173
-   SQLite database file is auto-created


------------------------------------------------------------------------

# 七 Author

David Yu

------------------------------------------------------------------------
