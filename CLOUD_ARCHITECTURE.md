# ☁️ Cloud Architecture — Food Ordering App

---

## 1. Service Model Choice

| Component | Model | Tool | Reason |
|---|---|---|---|
| React Frontend | **PaaS** | Vercel / Netlify | Deploy with one push, no server management needed |
| Express API | **PaaS** | Railway / Render | Managed scaling, runtime, and patches |
| API on full control | **IaaS** | AWS EC2 | When OS-level control or custom configuration is required |
| Background Jobs (e.g. order emails) | **FaaS** | AWS Lambda | Event-driven, runs only on trigger, billed per request |

```
┌─────────────────────────────────────────────────────┐
│                  Service Models                     │
│                                                     │
│  IaaS          PaaS            FaaS                 │
│  ┌──────┐     ┌──────┐        ┌──────┐             │
│  │  VM  │     │ App  │        │ Fn() │             │
│  │  OS  │     │Platform       │      │             │
│  │ Deps │     │managed        │on    │             │
│  │ App  │     │      │        │demand│             │
│  └──────┘     └──────┘        └──────┘             │
│  You manage   Less to manage  Minimal management   │
│  the most     the middle      the least            │
└─────────────────────────────────────────────────────┘
```

---

## 2. Regions & Availability Zones

- **Region:** `eu-west-1` (Ireland) — closest to target users
- **Availability Zones:** Deploy across **AZ-1** and **AZ-2** for redundancy

```
Region: eu-west-1
┌──────────────────────────────────────────┐
│                                          │
│   ┌─────────────┐   ┌─────────────┐     │
│   │    AZ - 1   │   │    AZ - 2   │     │
│   │             │   │             │     │
│   │  [API Server│   │  API Server]│     │
│   │             │   │             │     │
│   └─────────────┘   └─────────────┘     │
│                                          │
│   If AZ-1 fails → AZ-2 keeps running    │
└──────────────────────────────────────────┘
```

---

## 3. VPC & Subnet Design

```
VPC: 10.0.0.0/16
│
├── Public Subnet (10.0.1.0/24)
│   ├── Internet Gateway (IGW)  ←── Users from the internet
│   └── Load Balancer           ←── Receives all incoming traffic
│
└── Private Subnet (10.0.2.0/24)
    ├── NAT Gateway              ←── Outbound only (no inbound from internet)
    └── Express API Server       ←── Not directly exposed to the internet
```

**Traffic Flow:**
```
Internet
   │
   ▼
Internet Gateway (IGW)
   │
   ▼
Load Balancer  ──── Public Subnet (10.0.1.0/24)
   │
   ▼
Express API    ──── Private Subnet (10.0.2.0/24)
   │
   ▼
NAT Gateway (outbound updates only)
```

| Subnet | Type | Contains | Internet Access |
|---|---|---|---|
| 10.0.1.0/24 | Public | Load Balancer | ✅ Inbound + Outbound via IGW |
| 10.0.2.0/24 | Private | API Server | ⬆️ Outbound only via NAT |

---

## 4. High Availability Design

```
              Users
                │
         ┌──────▼──────┐
         │ Load Balancer│
         └──────┬───────┘
                │
       ┌────────┴────────┐
       │                 │
  ┌────▼────┐       ┌────▼────┐
  │  AZ - 1 │       │  AZ - 2 │
  │         │       │         │
  │[API     │       │[API     │
  │ Server] │       │ Server] │
  └─────────┘       └─────────┘

  If one AZ fails → Load Balancer
  routes all traffic to the other AZ
  automatically. Zero downtime.
```

**HA Principles applied in this project:**

| Principle | Implementation |
|---|---|
| No Single Point of Failure | API deployed across 2 AZs |
| Stateless Application | Express API holds no session data — any instance can serve any request |
| Health Checks | `/api/health` endpoint returns `{ ok: true }` — Load Balancer uses it to detect failures |
| Auto Recovery | Unhealthy instances are replaced automatically |

---

## 5. RPO & RTO Targets

| Metric | Full Name | Definition | Target |
|---|---|---|---|
| **RPO** | Recovery Point Objective | Maximum data loss we can tolerate | 1 hour |
| **RTO** | Recovery Time Objective | Maximum time to restore service after failure | 15 minutes |

---

## 6. Cost Model

| Workload | Instance Type | Reason |
|---|---|---|
| API Server (always on) | **Reserved** | Predictable 24/7 load → ~40% savings vs on-demand |
| Traffic spikes | **On-Demand** | Pay only when needed, no commitment |
| Background batch jobs | **Spot** | Cheapest option, fault-tolerant tasks can restart if interrupted |

```
Cost vs Flexibility:

Spot        ████░░░░░░  Cheapest  — can be interrupted
Reserved    ██████░░░░  Balanced  — commit 1-3 years
On-Demand   ██████████  Most expensive — most flexible
```

---

## 7. Shared Responsibility Model

```
┌─────────────────────────────────────────────────┐
│              Shared Responsibility               │
│                                                 │
│  CUSTOMER Responsibility                        │
│  ┌───────────────────────────────────────────┐  │
│  │ App Code & Business Logic                 │  │
│  │ IAM & Access Control                      │  │
│  │ Data Encryption (keys managed by me)      │  │
│  │ Secrets & API Keys                        │  │
│  │ OS Patching (IaaS only)                   │  │
│  │ Network Rules (Security Groups, ACLs)     │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  PROVIDER Responsibility                        │
│  ┌───────────────────────────────────────────┐  │
│  │ Physical Datacenters & Hardware           │  │
│  │ Power, Cooling & Physical Security        │  │
│  │ Network Infrastructure                    │  │
│  │ Hypervisor                                │  │
│  │ Managed Service Runtime (PaaS/FaaS)       │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

| Task | Provider | Customer |
|---|---|---|
| Replace a failed disk in the datacenter | ✅ | |
| Guard the physical building | ✅ | |
| Patch the managed runtime (PaaS) | ✅ | |
| Patch a Linux VM (IaaS) | | ✅ |
| Manage IAM roles and permissions | | ✅ |
| Encrypt application data | | ✅ |
| Secure application secrets | | ✅ |

---

## 8. CI/CD + Docker Deployment Pipeline

```
Developer pushes code
         │
         ▼
  GitHub Actions CI
  ┌──────────────────────┐
  │ 1. npm ci            │
  │ 2. ESLint check      │
  │ 3. Prettier check    │
  │ 4. Vitest (8 tests)  │
  └──────────┬───────────┘
             │ All pass ✅
             ▼
     Build Docker Image
    (from backend/Dockerfile)
             │
             ▼
       Docker Hub / Registry
             │
             ▼
       Cloud Server
    docker compose up -d
             │
             ▼
    API running in container
    on port 5000 ✅
```

---

## 9. Full System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLOUD (AWS)                         │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │                 VPC 10.0.0.0/16                  │   │
│  │                                                  │   │
│  │  Public Subnet 10.0.1.0/24                       │   │
│  │  ┌────────────────────────────────────────────┐  │   │
│  │  │  Internet Gateway ──► Load Balancer        │  │   │
│  │  └────────────────────────┬───────────────────┘  │   │
│  │                           │                      │   │
│  │  Private Subnet 10.0.2.0/24                      │   │
│  │  ┌──────────────┐   ┌──────────────┐             │   │
│  │  │  API (AZ-1)  │   │  API (AZ-2)  │             │   │
│  │  │  [Docker]    │   │  [Docker]    │             │   │
│  │  └──────────────┘   └──────────────┘             │   │
│  │           │                                      │   │
│  │      NAT Gateway (outbound only)                 │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  React Frontend (PaaS — Vercel)                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Served from CDN globally                        │   │
│  │  Calls API via HTTPS                             │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```