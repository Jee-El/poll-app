# Poll App

## Overview

A simple web app to create and vote on polls with real-time results.

---

## How to run

### Backend

1. `cd backend`

2. Create and activate a virtual environment (optional but recommended):

    ```bash
    python -m venv venv
    source venv/bin/activate  # macOS/Linux
    venv\Scripts\activate     # Windows

    ```

3. `pip install -r requirements.txt`
4. `cp .env.example .env`
5. Generate a secret key:
   `python -c "from django.core.management.utils import get_random_secret_key; print('SECRET_KEY=' + get_random_secret_key())"`
   Copy the output and replace it in `SECRET_KEY=` in `.env`
6. `python manage.py migrate`
7. `python manage.py runserver`

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`

Backend runs on http://localhost:8000
Frontend runs on http://localhost:3000

## Description (Français)

Application web pour créer, partager et participer à des sondages en ligne, avec interface intuitive et résultats en temps réel.

### Fonctionnalités

-   Création de sondages (choix simple/multiple)
-   Vote via lien ou code d’accès
-   Authentification utilisateurs
-   Partage via liens personnalisés

### Technologies

-   Backend : Django, Django REST Framework
-   Frontend : React, Vite
-   UI : shadcn/ui
-   Routage : React Router
-   API : Axios
-   Auth : JWT via djangorestframework_simplejwt

---

## Description (English)

Web platform for creating, sharing, and voting on polls with live results.

### Features

-   Custom polls (single/multiple choice)
-   Voting via link or access code
-   User authentication
-   Shareable voting links

### Tech Stack

-   Backend: Django + DRF
-   Frontend: React + Vite
-   UI: shadcn/ui
-   Routing: React Router
-   API: Axios
-   Auth: JWT (djangorestframework_simplejwt)
