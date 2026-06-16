# LifeData – Insurance Onboarding & KYC Platform

## Description

LifeData is an application for insurance companies to onboard individuals, corporate clients, and employees under group‑life policies. It provides an admin dashboard for KYC verification, a company portal for employee management, and a secure multi‑step registration wizard.

## Features

- **Multi‑type registration** – Individual, corporate, and employee group‑life with a shared wizard.
- **NIN verification** – Live check using RSA‑encrypted NIN and official NIMC data.
- **Admin dashboard** – Analytics charts, verification tabs (NIN, documents, companies), and a unified verification modal.
- **Roles & permissions UI** – Super‑admin panel to create custom roles and assign permissions.
- **Company portal** – Employee stats, recent hires, and pending invitations.
- **Encryption** – RSA‑OAEP (SHA‑1) for NIN/BVN using the Web Crypto API.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query
- React Hook Form + Zod
- Recharts
- Axios

## Installation

```bash
git clone https://github.com/your-username/lifedata-frontend.git
cd lifedata-frontend
npm install
```