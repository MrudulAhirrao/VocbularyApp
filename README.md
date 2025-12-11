# 📚 Vocab App (Crane Design)

A full-stack Vocabulary Web Application built with **Next.js**, **TypeScript**, and **GraphQL**. This app implements the [Material Design "Crane" Case Study](https://material.io/design/material-studies/crane.html), featuring a distinct purple/white theme, Kumbh Sans typography, and asynchronous data fetching from the **Oxford Dictionaries API**.

## 🚀 Live Demo
**[Insert Your Vercel Link Here]** *(e.g., https://vocab-app-mrudul.vercel.app)*

---

## ✨ Features

* **Add Words Asynchronously:** Fetches real-time definitions, pronunciation, and examples from the Oxford Dictionaries API.
* **Smart Fallback System:** Uses a hybrid architecture (API + Rich Internal Dictionary) to ensure the app never crashes, even if API rate limits are hit.
* **Search & Filter:** Instant search functionality to filter the word list.
* **Rich Details View:** Full-screen modal displaying:
    * Lexical Category (Noun/Verb/Adjective)
    * Phonetic Spelling
    * Audio Pronunciation (Playable)
    * Example Sentences
* **Responsive Design:** Fully optimized for Mobile and Desktop using Material UI v6.
* **State Management:** Redux Toolkit for UI state and Apollo Client for data caching.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
* **Language:** TypeScript
* **API Layer:** GraphQL (Apollo Server Micro)
* **Frontend State:** Redux Toolkit & Apollo Client
* **UI Library:** Material UI (MUI v6)
* **Styling:** Emotion (CSS-in-JS) & Custom "Crane" Theme
* **Data Source:** Oxford Dictionaries API (Axios)
* **Deployment:** Vercel

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone <your-repo-link>
cd vocab-app
npm install
```
---
### 2. Configure Environment Variables
```bash
# Oxford Dictionaries API Credentials
OXFORD_APP_ID=your_oxford_app_id
OXFORD_APP_KEY=your_oxford_app_key

# Database Connection (Optional for Mock Mode)
MONGODB_URI=mongodb://localhost:27017/vocab
```
### 3. Run Development Server
```bash
npm run dev
```
