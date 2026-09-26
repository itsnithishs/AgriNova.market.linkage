# AgriNova — Strengthening Market Linkages & Price Discovery for Farmers

> **Theme**: Agriculture, FoodTech & Rural Development  
> **Core Identity**: From Market Price to Realisable Value  
> **Key Statement**: *Know the Price. Compare the Market. Find the Value. Connect with Buyers.*

---

## 🌾 1. Executive Summary & Problem Context

Indian farmers frequently face fragmented market intelligence, severe mandi price volatility, and heavy transportation deductions. A farmer often asks:
> *"Paddy is ₹2,950/quintal in my local mandi, but ₹3,040 in Kanchipuram 72 km away. Should I hire a lorry and travel there, or will diesel freight, tolls, handling, and cess wipe out my gain? Which verified millers are buying right now, and what take-home net money will actually hit my bank account?"*

Existing platforms merely display raw wholesale ticker rates without answering the economic reality of the farmer: **Realisable Net Return**.

**AgriNova solves this fundamental gap by connecting the entire farmer commercial journey:**
```
FARM → CROP → MARKET → PRICE → COMPARE → NET VALUE → BUYER → SALE → PAYMENT
```

---

## 🚀 2. Core Product Architecture & Features

### Level 1 — Core Market Linkage (Primary Product)
1. **Interactive Market Price Discovery**:
   - Live modal rates, daily minimum/maximum spreads, arrivals volume, and benchmark status.
   - Transparent data status labels: `DEMO BENCHMARK DATA`, `UPDATED`, `ESTIMATED FORECAST`.
2. **Interactive Hardware-Accelerated Price Charts**:
   - `7D | 30D | 3M | 6M | 1Y` timeframes.
   - Dynamic crosshairs, tooltips with date, price, and daily change.
   - **Click-to-Inspect Contributing Market Signals**: Clicking any point highlights contextual factors (e.g. *lower arrivals due to rainfall, local mill procurement surge*).
   - 30-Day benchmark average reference line.
3. **AI Price Outlook (Estimated Ranges)**:
   - 7D, 15D, 30D, 45D, 60D forecast ranges with confidence corridors.
   - Transparent disclaimer: *Never claims absolute financial certainty; provides estimated ranges based on arrival volume and seasonal trends.*
4. **Net Realisable Value Calculator (Differentiator Feature)**:
   - Transparent formula:
     $$\text{Estimated Net Value} = \text{Gross Produce Value} - (\text{Estimated Transport Freight} + \text{Additional Handling/Cess})$$
   - Real-time sliders for quantity and transport distance.
5. **Nearby Mandi Comparison**:
   - Side-by-side comparison across 5 nearby markets (Tiruvannamalai, Kanchipuram, Vellore, Chengalpattu, Krishnagiri).
   - Real-time transport deduction to rank by **Best Net Realisation** rather than deceptive gross prices.
   - Mobile-responsive stacked cards for phone viewports.
6. **Selling Window Advisory**:
   - Neutral market interpretation contextualizing current price against the 30-day average and forward supply pressure.
7. **Direct Buyer Matching & Transparent Match Score**:
   - Verified buyers (rice mills, oil refineries, government DPCs).
   - Transparent Match Score (e.g. `94% Match`) with *"Why this match?"* breakdown (crop match, lot size fit, delivery radius, payment terms).
8. **Offer Comparison & Sale Confirmation Timeline**:
   - Compare multiple buyer offers with net take-home calculations.
   - Status timeline: `Draft → Published → Buyer Interest → Offer Received → Sale Confirmed → Completed`.
   - Confirming a sale automatically updates the transactional Money tracker.

### Level 2 — Farm Context & FarmCare
- **Farm Overview**: Land acreage (4.5 acres), Patta verification, soil health, irrigation schedules.
- **Harvest-to-Market Timeline**: Connects sowing, grain filling, harvest date, and target selling window.
- **Add Crop (Auto-Sync)**: Adding or updating a crop synchronizes seamlessly across Dashboard, Market Intelligence, FarmCare, and Sell to Buyers without duplicate data entry.
- **Crop Health**: Non-speculative vitality breakdown (Crop condition, irrigation balance, weather risk, task adherence).
- **Weather Farm Implications**: Translates meteorological data into actionable advice for harvesting, irrigation, transport, and spraying.
- **Field Task Scheduler**: Interactive task manager with completion checks.

### Level 3 — Support & Advisory
- **Government Support Schemes**: Filtered for state and land category (PM-KISAN, PMFBY, Agri Infra Fund, SMAM, Kalaignarin Scheme) with direct official portal links.
- **Financial Support**: Kisan Credit Card (KCC), e-NWR warehouse receipt pledge financing, post-harvest working capital.
- **Agricultural Knowledge Hub**: Practical guides on moisture testing without digital meters, hermetic storage, and APMC bidding protocols.
- **AgriNova Assistant**: Context-aware agriculture assistant pre-loaded with current crop, market rate, and net return data.

### Level 4 — Account, Security & Privacy
- **Farmer Profile**: Masked bank account (`•••• •••• 4821`), IFSC, Aadhaar and Patta documents.
- **Regional Languages**: Architecture supporting English, Tamil (தமிழ்), Hindi (हिन्दी), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Marathi (मराठी).
- **Security & Login Audit**: Device session history, 2-factor OTP simulation, and data privacy principles.

---

## 🛠️ 3. Technical Stack & Clean Architecture

- **Frontend**: Pure modern ES6+ JavaScript Modules (zero external npm build fragility, zero dependency vulnerabilities).
- **Styling**: Bespoke modern CSS3 design system with custom properties, responsive grid/flexbox layouts, and restrained agricultural aesthetics (`#1B4D3E` emerald, `#F9FAF6` linen cream, `#C87A1E` harvest gold).
- **Iconography**: Crisp feather/lucide style lightweight SVG icons.
- **Visualizations**: Zero-dependency hardware-accelerated HTML5 Canvas charts with retina display support (`devicePixelRatio`), smooth cubic bezier curve interpolation, interactive hover crosshairs, and confidence corridors.
- **State Management**: Centralized reactive State Store (`store.js`) using the Observer Pattern ensuring 100% data consistency across all views.
- **Server**: Lightweight zero-dependency Node static HTTP server (`server.js`) included for instant local preview or direct deployment to GitHub Pages.

---

## 💻 4. Running AgriNova Locally

### Prerequisites
- Node.js (v18+) or any standard static file server.

### Start the Local Server
```bash
# From the project directory:
node server.js
```
Open **[http://localhost:4173](http://localhost:4173)** in any web browser.

---

## 📱 5. Responsive Design Standards Tested

- **Desktop Formats**: 1280×800, 1366×768, 1440×900, 1536×864, 1920×1080.
- **Mobile Viewports**: 360×800, 375×812, 390×844, 412×915, 430×932.
- **Zero dead buttons**: Every action opens a modal, toggles state, filters data, or triggers feedback.
- **Zero horizontal overflow**: Clean, well-organized scrolling on both phone and desktop.
