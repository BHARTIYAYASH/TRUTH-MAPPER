# Argument Cartographer

Argument Cartographer is an advanced AI-powered platform designed to map, analyze, and visualize complex arguments and narratives. It leverages Large Language Models (LLMs) and real-time web data to break down controversial topics into structured logical blueprints, identifying claims, evidence, logical fallacies, and social sentiment.

## Project Overview

In an era of information overload and polarized discourse, Argument Cartographer provides a neutral, analytical lens. By automatically decomposing arguments into their constituent parts—Theses, Claims, Counterclaims, and Evidence—it allows users to navigate the logical structure of a debate rather than just consuming the rhetoric. The system integrates real-time web search and social media listening to provide up-to-the-minute context and "brutally honest" credibility assessments.

## Key Features

-   **Interactive Argument Mapping**: Visualizes the logical flow of arguments using a node-based interface, allowing users to trace claims to their supporting evidence.
-   **Logical Fallacy Detection**: Automatically identifies and categorizes logical flaws (e.g., Ad Hominem, Straw Man) within arguments, providing educational explanations and severity ratings.
-   **Narrative Radar**: A curated feed of high-impact, trending topics analyzed for logical integrity and public sentiment.
-   **Real-Time Context**: Integrates data from trusted news sources (via Firecrawl) and social discourse (via X/Twitter API) to ground analysis in current reality.
-   **Credibility Scoring**: Assigns a data-backed credibility score to arguments based on the strength of evidence and presence of fallacies.

## Technical Architecture

The application is built on a modern Next.js 15 stack, utilizing Google's Genkit for AI orchestration and Firebase for data persistence.

```mermaid
graph TD
    Client[Client (Next.js 15)] -->|Submit Topic/URL| ServerActions[Server Actions]
    
    subgraph "AI Orchestration (Genkit)"
        ServerActions -->|Trigger Flow| GenFlow[Generate Argument Blueprint]
        GenFlow -->|Step 1: Context| Tools[Tools Layer]
        
        subgraph "External Data Sources"
            Tools -.->|Fetch Articles| Firecrawl[Firecrawl (Web Search)]
            Tools -.->|Fetch Sentiment| Twitter[Twitter API v2]
        end
        
        Tools -->|Aggregated Data| GenPrompt[Gemini 1.5 Pro Prompt]
        GenPrompt -->|Structured JSON| GenFlow
        GenFlow -->|Validate Schema| ZodSchema[Zod Validation]
    end
    
    subgraph "Data & Auth"
        ServerActions -->|Persist Result| Firestore[(Firebase Firestore)]
        Client -->|Auth Check| FirebaseAuth[Firebase Auth]
    end
    
    ZodSchema -->|Return Analysis| ServerActions
    ServerActions -->|Render Visuals| Client
```

## Technology Stack

-   **Frontend**: Next.js 15 (App Router), React 18, Tailwind CSS, Framer Motion
-   **AI & Logic**: Google Genkit, Google Gemini 1.5 Pro
-   **Data Processing**: Firecrawl (Web Scraping), Twitter API v2 (Social Listening)
-   **Backend/Database**: Firebase Firestore, Firebase Authentication
-   **Visualization**: React Flow (Argument Maps), Recharts (Data Viz)

## Installation and Setup

### Prerequisites

-   Node.js 18+ installed
-   Git installed
-   A Firebase project
-   API Keys for Google GenAI, Firecrawl, and X (Twitter)

### Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/BHARTIYAYASH/ARGX.git
    cd ARGX
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and configure the following variables:

    ```env
    # AI Config
    GOOGLE_GENAI_API_KEY=your_gemini_key

    # External Tools
    FIRECRAWL_API_KEY=your_firecrawl_key
    TWITTER_BEARER_TOKEN=your_twitter_token

    # Firebase Client Config
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

    # Firebase Admin Config (for Server Actions)
    SERVICE_ACCOUNT_PROJECT_ID=your_project_id
    SERVICE_ACCOUNT_CLIENT_EMAIL=your_client_email
    SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your code to a GitHub repository.
2.  Import the project in Vercel.
3.  Add all the Environment Variables listed above in the Vercel Project Settings.
4.  Deploy.

---

**Argument Cartographer** — *Mapping the landscape of truth.*
