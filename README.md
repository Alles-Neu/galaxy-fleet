# Galaxy Fleet Management System

Modernes Flottenmanagementsystem — Nachbau des Crown Galaxy/EuRide Portals.

**Stack:** React + Vite + TypeScript + Tailwind (Frontend) | NestJS + Prisma + PostgreSQL (Backend)

---

## Schnellstart (Frontend mit Mock-Daten)

```bash
git clone https://github.com/Alles-Neu/galaxy-fleet.git
cd galaxy-fleet/packages/web
npm install
npm run dev
```

Öffne **http://localhost:5173** — Login mit beliebigen Daten (Mock-Modus).

---

## Vollstack mit Datenbank

Voraussetzung: Docker muss installiert sein.

```bash
# 1. Repo klonen
git clone https://github.com/Alles-Neu/galaxy-fleet.git
cd galaxy-fleet

# 2. PostgreSQL starten
docker compose up db -d

# 3. Backend starten
cd packages/api
cp .env .env.local          # ggf. anpassen
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev

# 4. Frontend starten (neues Terminal)
cd packages/web
npm install
npm run dev
```

- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:3000**
- Swagger Docs: **http://localhost:3000/api/docs**
- Login: `admin` / `admin123`

---

## Projektstruktur

```
galaxy-fleet/
├── docker-compose.yml          # PostgreSQL + API + Frontend
├── packages/
│   ├── api/                    # NestJS Backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # 26 Tabellen, vollständiges Datenmodell
│   │   │   └── seed.ts         # Stammdaten (18 Status, 89 Dokumenttypen, 87 Behörden, 24 Standorte)
│   │   └── src/
│   │       ├── auth/           # JWT Login + Rollen
│   │       ├── vehicle/        # Fahrzeuge + Unter-Entitäten
│   │       ├── handover/       # Übergaben
│   │       ├── workshop/       # Service/Werkstatt
│   │       ├── accident/       # Unfälle
│   │       ├── offense/        # Verkehrsverstöße
│   │       ├── milkyway/       # Touren, WOW, Ageing
│   │       ├── dashboard/      # KPIs, Alerts
│   │       └── admin/          # Einstellungen, Stammdaten, Logs
│   └── web/                    # React Frontend
│       └── src/
│           ├── pages/          # 15 Seiten (Dashboard, Fahrzeuge, MilkyWay, Admin, ...)
│           ├── components/     # Sidebar, DataTable, Filter, StatusBadge, KPI-Cards
│           └── lib/            # API-Client, Mock-Daten
└── docs/
    └── superpowers/specs/      # Design-Spezifikation
```

## Module

| Modul | Beschreibung |
|-------|-------------|
| **Venus** | Fahrzeugliste, Inventur, Übergabe, Service/Werkstatt, Unfälle, Verkehrsverstöße |
| **MilkyWay** | Tägliche Tourenplanung (7 Stationen), Week-over-Week Auswertung, Ageing Tours |
| **Admin** | Stammdaten-Pflege, Änderungslogs, Benutzer |
| **Dashboard** | KPIs, Flottenstatus, Alerts, Tourenstatistik |
