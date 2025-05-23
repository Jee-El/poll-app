# Poll App

## Team Members

-   **Lhoussaine GHALLOU**
-   **Hafsa BOUZIDI**
-   **Sara CHETOUANE**

This is a simple web application for creating and participating in polls. Users can vote on various questions, and the results are displayed in real-time.

## Table of Contents

-   [Description en Français](#description-en-français)
-   [English Description](#english-description)

## Description en Français

L'application de sondage est une plateforme web qui permet aux utilisateurs de créer, partager et participer facilement à des sondages en ligne. Elle vise à fournir une interface fluide et accessible pour recueillir des avis et analyser les résultats en temps réel.

### Fonctionnalités principales :

-   **Création de sondages** : Les utilisateurs peuvent créer des sondages personnalisés avec différentes options de réponse (choix unique, choix multiple, etc.).
-   **Participation aux sondages** : Les participants peuvent voter facilement via un lien ou un code d'accès.
-   **Authentification** : Les utilisateurs peuvent s'inscrire et se connecter pour gérer leurs sondages.
-   **Partage et distribution** : Génère des liens partageables pour inviter d'autres à voter.

### Stack et technologies :

-   Backend développé en **Django** avec une API REST, en utilisant **djangorestframework** pour la gestion des sondages, des utilisateurs, et des votes.
-   Frontend développé avec **React** et **Vite** pour un démarrage rapide et une expérience de développement fluide.
-   Utilisation de **shadcn/ui** pour les composants UI modernes et personnalisables.
-   Navigation gérée par **React Router** pour un routage client efficace.
-   Requêtes API effectuées avec **Axios** pour une communication simple et efficace avec le backend.
-   Authentification sécurisée via **djangorestframework_simplejwt**.

## English Description

The poll application is a web platform that allows users to create, share, and participate in online polls easily and intuitively. It aims to provide a smooth and accessible interface for collecting opinions and analyzing results in real time.

### Main Features:

-   **Poll Creation**: Users can create custom polls with different response options (single choice, multiple choice, etc.).
-   **Poll Participation**: Participants can vote easily via a link or access code.
-   **Authentication**: Users can sign up and log in to manage their polls.
-   **Sharing and Distribution**: Generates shareable links to invite others to vote.

### Tech Stack and Setup:

-   Backend built with **Django**, exposing RESTful API endpoints, built with **djangorestframework**, for polls, users, and votes.
-   Frontend built using **React** with **Vite** for fast development and build performance.
-   UI components from **shadcn/ui** for modern and customizable design elements.
-   Client-side routing managed with **React Router**.
-   API calls handled via **Axios** for simplified HTTP requests to the backend.
-   Secure authentication handled using **djangorestframework_simplejwt** for JSON Web Token-based auth.
