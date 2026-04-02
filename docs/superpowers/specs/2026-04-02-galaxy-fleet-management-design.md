# Galaxy Fleet Management System — Design Spec

**Date:** 2026-04-02
**Status:** Approved
**Goal:** 1:1 functional rebuild of Crown Galaxy/EuRide fleet portal, modernized stack

---

## 1. System Overview

Rebuild of https://euride.galaxy.ooo — a fleet management portal for EuRide GmbH managing ~270 vehicles across 7 delivery stations (AMZL, GLS, DPD) with ~150 users.

Three core modules:
- **Venus** — Fleet management (vehicles, handovers, workshop, accidents, traffic offenses, inventory)
- **MilkyWay** — Delivery tour operations (daily tours, WOW analytics, ageing tours)
- **Admin** — Settings, master data, change logs

## 2. Architecture

### Stack
- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** NestJS + TypeScript + Prisma ORM
- **Database:** PostgreSQL 16
- **Auth:** JWT + Refresh Tokens
- **Infrastructure:** Docker Compose (dev = prod parity)
- **Deployment target:** Hetzner Cloud (~25 EUR/month)

### Repo Structure (Monorepo)
```
galaxy-fleet/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── packages/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── vehicle/
│   │   │   ├── handover/
│   │   │   ├── milkyway/
│   │   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   └── common/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── seed.ts
│   │   │   └── migrations/
│   │   └── Dockerfile
│   └── web/                    # React frontend
│       ├── src/
│       │   ├── pages/
│       │   ├── components/
│       │   ├── lib/
│       │   └── hooks/
│       ├── Dockerfile
│       └── nginx.conf
└── docs/
```

## 3. Data Model

### Core Tables

**vehicle** (56 fields)
- id, license_plate, fin, qr_code, brand_id, model, first_registration
- company_id, station_id, status_id, fleet_location
- km_reading, alarm_odometer
- procurement_type_id, procured_by, procured_from
- insurance_company_id, insurance_number, fully_comprehensive, partial_coverage, fc_deductible, pc_deductible
- fire_extinguisher, first_aid_kit, kit_tool, dkv_box, dkv_box_number
- eu_licence, eu_licence_number, speed_limited, gps_tracking, gps_tracking_company
- snow_chains, fuel_card, fuel_card_number, private_trip_tracking
- sticker_type, service_vehicle, weight_class, inventory_interval
- created_at, updated_at

**employee**
- id, personnel_number, prefix (company prefix), full_name, company_id, is_ad (auf Dienst), active

**company**
- id, name, address, station_id

**station**
- id, code (DHH1), full_name, address, type (depot|workshop|rental|hq|virtual), company_id, client (AMZL|GLS|DPD|internal)

**user**
- id, username, password_hash, role, station_ids[], active, created_at

### Transaction Tables

**handover**
- id, vehicle_id, km_reading, from_employee_id, to_employee_id, from_station_id, to_station_id
- handover_date, created_by_user_id, confirmed, created_at

**workshop_order**
- id, vehicle_id, km_reading, from_employee_id, to_employee_id, from_station_id, to_station_id
- handover_date, duration_days, notes, status (neu|geprueft|abgeschlossen)
- created_by_user_id, created_at

**accident**
- id, accident_date, vehicle_id, station_id, personnel_number, driver_name
- status (nicht_abgearbeitet|in_bearbeitung|abgearbeitet)
- processing_status (8 wait states), fault_type_id, case_handler
- created_at

**traffic_offense**
- id, offense_date, vehicle_id, personnel_number, driver_name
- offense_type_id, authority_id, fine_amount, reference_number
- confirmation_status (nicht_bestaetigt|lohnbuchhaltung|fibu|lkw)
- created_at

**tour**
- id, tour_number, station_id, employee_id, vehicle_id
- tour_date, tour_type (normal|extra|rescue|sub_rescue|absent)
- absence_type_id, returns_count, return_info, support_station_id
- created_at

**inventory_check**
- id, vehicle_id, station_id, interval_type, completed, check_date, created_at

**service_record**
- id, vehicle_id, service_date, km_reading, description, alarm_odometer, phone_number, created_at

**fuel_record**
- id, vehicle_id, record_date, km_reading, fuel_amount, created_at

**document**
- id, vehicle_id, document_type_id, file_path, file_name, uploaded_by_user_id, created_at

**vehicle_image**
- id, vehicle_id, file_path, file_name, uploaded_by_user_id, created_at

**ticket**
- id, vehicle_id, group_name, subject, body, created_by_user_id, created_at

**change_log**
- id, vehicle_id, field_name, old_value, new_value, changed_by_user_id, changed_at

### Master Data Tables (admin-editable)

- vehicle_status (18 entries)
- vehicle_brand (9) + vehicle_model (N per brand)
- procurement_type (5)
- document_type (89)
- insurance_company (5)
- offense_type (9)
- offense_authority (87, with email)
- fault_type (6)
- accident_processing_status (8)
- absence_type (4)
- tire_type, tire_status
- weight_class

## 4. API Endpoints

### Auth
- POST /api/auth/login
- POST /api/auth/refresh
- GET /api/auth/me

### Dashboard
- GET /api/dashboard/kpis
- GET /api/dashboard/alerts
- GET /api/dashboard/status-distribution
- GET /api/dashboard/tour-stats
- GET /api/dashboard/inventory-overview

### Vehicles
- GET/POST /api/vehicles
- GET/PATCH/DELETE /api/vehicles/:id
- GET/POST /api/vehicles/:id/documents
- GET/POST /api/vehicles/:id/images
- GET /api/vehicles/:id/fuel-records
- POST /api/vehicles/:id/fuel-records
- GET /api/vehicles/:id/service-records
- POST /api/vehicles/:id/service-records
- GET /api/vehicles/:id/changelog
- GET/POST /api/vehicles/:id/tickets
- GET /api/vehicles/:id/notes
- POST /api/vehicles/:id/notes
- GET /api/vehicles/export

### Handovers
- GET/POST /api/handovers
- GET /api/handovers/:id
- PATCH /api/handovers/:id/confirm
- GET /api/handovers/export

### Workshop
- GET/POST /api/workshop-orders
- GET /api/workshop-orders/:id
- PATCH /api/workshop-orders/:id/status
- GET /api/workshop-orders/export

### Accidents
- GET/POST /api/accidents
- GET/PATCH /api/accidents/:id
- GET /api/accidents/export

### Traffic Offenses
- GET/POST /api/traffic-offenses
- GET/PATCH /api/traffic-offenses/:id
- GET /api/traffic-offenses/export

### Inventory
- GET /api/inventory
- POST /api/inventory/:vehicleId/check
- GET /api/inventory/export

### MilkyWay
- GET /api/milkyway/stations/:code/daily?date=
- POST /api/milkyway/tours
- GET /api/milkyway/stations/:code/wow
- GET /api/milkyway/stations/:code/wow-sub
- GET /api/milkyway/stations/:code/ageing
- GET /api/milkyway/search
- GET /api/milkyway/export

### Admin
- GET/PATCH /api/admin/settings
- GET /api/admin/settings/:category
- CRUD /api/admin/master-data/:type (brands, statuses, doc-types, authorities, etc.)
- GET /api/admin/logs

## 5. Frontend Pages

All list views use shared `<DataTable>` component with server-side pagination, filtering, sorting, and Excel export.

### Pages (18 routes)
1. /login
2. / (Dashboard)
3. /vehicles (list + 15 filters)
4. /vehicles/:id (detail with 11 tabs)
5. /vehicles/create
6. /inventory
7. /handovers
8. /handovers/create
9. /workshop
10. /workshop/create
11. /accidents
12. /accidents/create
13. /offenses
14. /offenses/create
15. /milkyway/:station/daily
16. /milkyway/:station/wow
17. /milkyway/:station/ageing
18. /milkyway/search
19. /admin/settings
20. /admin/logs

### Shared Components
- `<AppLayout>` — Sidebar (collapsible, station-grouped MilkyWay nav), Header, Breadcrumbs
- `<DataTable>` — configurable columns, pagination (10/25/50/100), sort, filter, export button
- `<FilterBar>` — renders filters from schema (select, date-range, text, checkbox)
- `<StatusBadge>` — color-coded status pills
- `<KpiCard>` — dashboard metric card with trend indicator
- `<TabView>` — for vehicle detail 11-tab layout
- `<ExcelExportButton>` — triggers API export with current filters

## 6. Auth & Roles

| Role | Access |
|------|--------|
| admin | Everything — settings, master data, user management, all stations |
| dispatcher | Vehicles, handovers, workshop, accidents, offenses — own stations |
| milkyway_dispatcher | MilkyWay tours — assigned stations only |
| clerk | Process accidents + offenses, read vehicles |
| readonly | Read-only access |

Station-scoped: each user has `station_ids[]`, only sees data for assigned stations (admin exempt).

## 7. Seed Data

Populate from crawled portal data:
- 18 vehicle statuses, 9 brands, 5 procurement types, 89 document types
- 5 insurance companies, 9 offense types, 87 authorities with emails
- 6 fault types, 8 processing statuses, 4 absence types
- 24 stations with full addresses
- 3 companies
- Demo vehicles (10-20 for prototype)
- Demo admin user

## 8. Non-Functional

- German UI language throughout (matching original)
- Responsive but desktop-first (original is desktop-only)
- Dark sidebar, light content area (matching Crown theme, modernized)
- All dates in DD.MM.YYYY format
- Currency in EUR with comma separator
- Automatic change_log for all vehicle field modifications via Prisma middleware
