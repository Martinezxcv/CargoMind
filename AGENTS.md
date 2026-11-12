# CargoMind AI – Ghost Cargo Engine (MVP)

## Project Conventions
- **Language Policy:** All user-facing text (UI labels, validation and error messages, AI summaries) MUST be in **English**. Code comments, variable names, and technical documentation must also be in **English**.
- **Communication:** Chat with me in **Polish**.

---

## 1. Context and Project Goal
CargoMind AI is an MVP-class application for TSL (Transport, Forwarding, Logistics) carriers designed to solve the problem of empty return trips (Ghost Cargo).
The system calculates the optimal return cargo using a hybrid architecture:
1. **Custom scoring algorithm in Java** (calculates match score 0–100%).
2. **LLM Integration (Google Gemini)** (interprets scoring results and generates business rationale).

---

## 2. Architecture & Tech Stack
- **Structure:** Monolith with Spring Boot (`/backend`) + React SPA (`/frontend`).
- **Backend:** Java, Spring Boot, Spring Data JPA, H2 Database (In-Memory).
- **Frontend:** React, TypeScript, Vite, Tailwind CSS (modern logistics dashboard styling).
- **Communication:** REST API. CORS is configured globally in `CorsConfig`
  (origins from `cors.allowed-origins` in application.yml), not per controller.

---

## 3. Scoring Logic (Java Engine)
The `ScoringEngineService` calculates `totalScore` (0–100) based on weighted factors:
- Route alignment (30%)
- Pickup proximity (20%)
- Financial profitability (30%)
- Vehicle compatibility (15% - hard requirement, otherwise score = 0)
- Deadline alignment (5%)

---

## 4. AI Integration (Gemini REST API)
- The backend sends a JSON payload to the Gemini API containing the calculated `score`, route data, and profit.
- Gemini returns a concise, 2-sentence expert summary comment for the driver ("AI Ghost Cargo Assistant").
- **Fallback Mode:** If the Gemini API key is missing, the service dynamically generates a fallback summary based on a template (the application **MUST** work without an external API key).

---

## 5. Coding Standards
- Write production-grade code utilizing Lombok (`@Data`, `@RequiredArgsConstructor`, etc.).
- Frontend code must be 100% strictly typed in TypeScript.
- Use clean DTO structures for REST communication and follow RFC 7807 (`ProblemDetail`) for error handling.