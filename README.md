# CargoMind AI – Ghost Cargo Engine (MVP)

CargoMind AI helps TSL carriers avoid empty return trips ("ghost cargo"). The carrier says where the
truck is, where it wants to go home and what vehicle it has. The system finds cargo offers on the way
back, scores each one (0–100%) and explains the result in two plain sentences.

## 🚀 Demo
https://github.com/user-attachments/assets/fd14fd5d-3e5f-4a0b-914a-5ef684de1b6e

**Hybrid architecture**

1. **Deterministic scoring engine (Java)** computes the match score. It is the single source of truth.
2. **LLM (Google Gemini)** only explains an already computed score. It never changes it.
3. **Fallback mode:** without an API key (or on any Gemini error) a template generates the summary,
   so the application works fully offline.

## Tech stack

| Layer    | Technology |
|----------|------------|
| Backend  | Java 25, Spring Boot 4.1.2, Spring Data JPA, H2 (in-memory), Lombok, Maven |
| Frontend | React, TypeScript (strict), Vite, Tailwind CSS v4 |
| AI       | Google Gemini REST API (optional) |

## Repository layout

```
cargomind-ai/
├── backend/    Spring Boot application (REST API, scoring, Gemini client)
├── frontend/   React SPA
├── .env.example
├── AGENTS.md   Project conventions and AI agent instructions
└── README.md
```

## Prerequisites

- JDK 25
- Node.js (current LTS; Vite requires 20.19+ or 22.12+)
- No database setup needed (H2 runs in memory)

## Quick start

```bash
# 1. Backend (http://localhost:8080)
cd backend
./mvnw spring-boot:run

# 2. Frontend (http://localhost:5173), in a second terminal
cd frontend
npm install
npm run dev
```

The demo data (30 cities in Poland and neighbouring countries, 22 offers) is loaded on every start.

### Enabling Gemini (optional)

Spring reads the key from the `GEMINI_API_KEY` environment variable (it does **not** read `.env` files):

```bash
export GEMINI_API_KEY=your-key      # Windows PowerShell: $env:GEMINI_API_KEY="your-key"
./mvnw spring-boot:run
```

Without the key the summaries come from the built-in template. If Gemini fails (timeout, invalid key,
retired model), the backend logs a warning and falls back per offer. Never commit the key and never
put it in the frontend.

> The model name in `application.yml` (`gemini.api.model`) changes over time. If you see
> `Gemini call failed` warnings with a valid key, check the current model name in Google AI Studio.

### Useful URLs

| What | URL |
|------|-----|
| Frontend | http://localhost:5173 |
| API base | http://localhost:8080/api |
| H2 console | http://localhost:8080/h2-console (JDBC URL `jdbc:h2:mem:cargomind`, user `sa`, empty password) |

## Scoring

`totalScore` is a weighted sum of five components, each scored 0–100.

| Component | Weight | Rule |
|-----------|--------|------|
| Route alignment | 30% | Distance from the offer's destination to the carrier's home base. 0 km → 100, ≥ 500 km → 0 |
| Pickup proximity | 20% | Empty drive from the carrier's location to the pickup. 0 km → 100, ≥ 300 km → 0 |
| Profitability | 30% | Margin per km over the whole trip (empty + loaded). −0.60 EUR/km → 0, break-even ≈ 50, +0.60 EUR/km → 100 |
| Vehicle compatibility | 15% | **Hard requirement:** same vehicle type and cargo weight ≤ payload. Otherwise `totalScore = 0` |
| Deadline alignment | 5% | Pickup before the carrier is available → 0. Same day → 100, −25 points per day of waiting |

Assumptions: distances are Haversine × 1.2 (road factor), operating cost is 1.00 EUR/km, currency is EUR.

All weights and thresholds are configurable in `application.yml` under `scoring`. Weights must sum to
1.0, otherwise the application refuses to start. The number of returned offers is `scoring.max-results`
(default 5).

## REST API

Errors follow RFC 9457 (`ProblemDetail`); validation errors include an `errors` map per field.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cities` | Cities for dropdowns |
| POST | `/api/cargo/search` | Scored return-cargo offers (top N, best first) |
| GET | `/api/offers` | All offers (earliest pickup first) |
| GET | `/api/offers/{id}` | One offer, or 404 |
| POST | `/api/offers` | Create an offer (201 + `Location`) |
| PUT | `/api/offers/{id}` | Update an offer, or 404 |
| DELETE | `/api/offers/{id}` | Delete an offer (204), or 404 |

Example search:

```bash
curl -s -X POST http://localhost:8080/api/cargo/search \
  -H 'Content-Type: application/json' \
  -d '{"currentLocation":"Berlin","homeBase":"Warszawa","containerType":"TRUCK_24T","maxPayloadKg":24000,"availableFrom":"2026-11-13"}'
```
## Configuration

| Property | Env override | Default | Purpose |
|----------|--------------|---------|---------|
| `gemini.api.key` | `GEMINI_API_KEY` | empty (fallback mode) | Gemini API key |
| `gemini.api.model` | – | see `application.yml` | Gemini model name |
| `gemini.api.timeout-seconds` | – | 20 | Gemini read timeout |
| `scoring.*` | – | see `application.yml` | Weights, thresholds, `max-results` |
| `cors.allowed-origins` | – | `http://localhost:5173` | Allowed CORS origins (global `CorsConfig`) |
| `VITE_API_URL` (frontend) | – | `http://localhost:8080/api` | Backend URL for the SPA |

## Known limitations

- **No authentication.** Anyone can create, edit and delete any offer; `companyName` is plain text.
- **In-memory database.** All data (including offers added through the UI) is reset on every restart.
- **CORS is configured for local development (`http://localhost:5173`).** Update `cors.allowed-origins` with your production domain before deployment.
- **EUR only**, with a fixed operating cost per km.
- **Search results do not refresh automatically** after offers change; run the search again.
- **No controller-level tests** (`@WebMvcTest`) yet.

## AI Assistance

Project was developed with deep AI collaboration (using Claude as the primary coding partner):
- **Architecture & Boilerplate:** AI assisted in designing the hybrid scoring architecture and generating initial backend and frontend structures.
- **Refactoring & Problem Solving:** Iterative prompting was used to refine the Java scoring engine, handle Spring Boot configuration updates (such as global CORS), and adjust React components and Tailwind styling.
- **Code Review & Quality:** All generated code, DTOs, and endpoints were verified, tested, and integrated manually to ensure production-grade quality and strict TypeScript typing.
