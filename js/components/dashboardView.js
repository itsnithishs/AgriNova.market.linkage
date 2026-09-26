/**
 * AgriNova Platform - Dashboard View ("What should I know today?")
 * Prioritizes Market Intelligence, Market Opportunity, Farm Snapshot, Tasks, Weather, and Health.
 * (Requirements 10–17, 80)
 */

import { Icons } from "./icons.js";
import { UI } from "./ui.js";
import { store } from "../state/store.js";

export function renderDashboard(state) {
  const farmer = state.farmer;
  const commodity = store.getCurrentCommodity();
  const primaryMandi = commodity.nearbyMandis?.[0] || {
    name: "Tiruvannamalai Mandi",
    pricePerQ: 2950,
    minPrice: 2780,
    maxPrice: 3080,
    distanceKm: 18,
    estTransportPerQ: 35
  };

  // Find best market opportunity (e.g. Kanchipuram)
  const oppMandi = commodity.nearbyMandis?.find((m) => m.pricePerQ > primaryMandi.pricePerQ) || commodity.nearbyMandis?.[1];
  const primaryNet = store.calculateNetValue(primaryMandi);
  const oppNet = oppMandi ? store.calculateNetValue(oppMandi) : null;
  const netDiff = oppNet ? oppNet.netRatePerQ - primaryNet.netRatePerQ : 0;

  // Active crop info from farm
  const activeCrop = state.crops.find((c) => c.id === state.selectedCropId) || state.crops[0];

  // Upcoming pending tasks
  const pendingTasks = state.tasks.filter((t) => t.status !== "COMPLETED").slice(0, 3);

  return `
    <div class="dashboard-container animate-fade-in">
      
      <!-- Top Greeting Bar (Requirement 10) -->
      <section class="dashboard-greeting-bar">
        <div class="greeting-content">
          <div class="greeting-eyebrow">
            <span>${Icons.sun("icon-xs")}</span>
            <span>${store.t("goodMorning")}, ${farmer.name.split(" ")[0]}</span>
          </div>
          <h1 class="greeting-title">${activeCrop.name} • ${farmer.farmSizeAcres} acres • ${farmer.district}</h1>
        </div>

        <div class="greeting-actions">
          <button class="btn btn-outline-white btn-sm" onclick="window.AgriNova.navigate('sell')">
            ${Icons.sell("icon-xs")}
            <span>${store.t("createListing")}</span>
          </button>
          <button class="btn btn-accent btn-sm" onclick="window.AgriNova.openAssistantWithContext()">
            ${Icons.bot("icon-xs")}
            <span>${store.t("askAgriNova")}</span>
          </button>
        </div>
      </section>

      <!-- Farm Snapshot Bar (Requirement 11) -->
      <section class="farm-snapshot-strip">
        <div class="snapshot-card">
          <span class="snap-label">Farm Land Size</span>
          <span class="snap-val">${farmer.farmSizeAcres} acres</span>
          <span class="snap-hint">${farmer.landOwnership.split("(")[0]}</span>
        </div>
        <div class="snapshot-divider"></div>
        <div class="snapshot-card">
          <span class="snap-label">Active Monitored Crop</span>
          <span class="snap-val">${activeCrop.name}</span>
          <span class="snap-hint">${activeCrop.variety}</span>
        </div>
        <div class="snapshot-divider"></div>
        <div class="snapshot-card">
          <span class="snap-label">Cultivation Date</span>
          <span class="snap-val">${activeCrop.cultivationDate}</span>
          <span class="snap-hint">${activeCrop.growthDays || 45} days elapsed</span>
        </div>
        <div class="snapshot-divider"></div>
        <div class="snapshot-card">
          <span class="snap-label">Expected Harvest</span>
          <span class="snap-val highlight">${activeCrop.expectedHarvest}</span>
          <span class="snap-hint">Est. ~${activeCrop.expectedQuantityQuintals} quintals</span>
        </div>
      </section>

      <!-- Main Grid: Market Intelligence + Opportunity (Requirements 12 & 13) -->
      <div class="dashboard-main-grid">
        
        <!-- Left Column: Today's Market (Most Visually Important) & Opportunity -->
        <div class="dashboard-left-col">
          
          <!-- TODAY'S MARKET CARD (Requirement 12) -->
          <div class="card todays-market-hero-card">
            <div class="card-header">
              <div class="header-tagline">
                <span class="eyebrow-accent">LEVEL 1 — MARKET INTELLIGENCE</span>
                <h2 class="card-title-lg">${store.t("todaysMarket")}</h2>
              </div>
              <div class="header-badges">
                ${UI.dataStatusBadge(commodity.dataStatus)}
              </div>
            </div>

            <div class="market-hero-price-strip">
              <div class="commodity-meta">
                <span class="commodity-name">${commodity.name}</span>
                <span class="commodity-mandi">${primaryMandi.name} (${primaryMandi.distanceKm} km away)</span>
              </div>
              
              <div class="price-mega-block">
                <div class="price-val">
                  <span class="currency">₹</span>
                  <span class="number">${commodity.currentPrice.toLocaleString("en-IN")}</span>
                  <span class="unit">/ quintal</span>
                </div>
                <div class="price-change-pill">
                  ${UI.trendBadge(commodity.change, commodity.changePercent)}
                </div>
              </div>
            </div>

            <!-- Price Range Metrics Bar -->
            <div class="market-metrics-bar">
              <div class="metric-col">
                <span class="metric-label">${store.t("minimum")}</span>
                <span class="metric-value">₹${commodity.minPrice.toLocaleString("en-IN")}</span>
              </div>
              <div class="metric-col modal-highlight">
                <span class="metric-label">${store.t("modal")} (Benchmark)</span>
                <span class="metric-value">₹${commodity.modalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div class="metric-col">
                <span class="metric-label">${store.t("maximum")}</span>
                <span class="metric-value">₹${commodity.maxPrice.toLocaleString("en-IN")}</span>
              </div>
              <div class="metric-col">
                <span class="metric-label">${store.t("lastUpdated")}</span>
                <span class="metric-value font-mono">${commodity.lastUpdated}</span>
              </div>
            </div>

            <!-- Interactive Quick Action to Enter Market Page -->
            <div class="hero-card-footer">
              <div class="market-quick-insight">
                ${Icons.info("icon-xs text-accent")}
                <span>30-Day Trend is <strong>${commodity.trend}</strong>. Arrivals: ${commodity.arrivalVolumeTonnes}t.</span>
              </div>
              <button class="btn btn-primary btn-sm" onclick="window.AgriNova.navigate('market')">
                <span>View Full Market Chart & Mandis</span>
                ${Icons.arrowRight("icon-xs")}
              </button>
            </div>
          </div>

          <!-- MARKET OPPORTUNITY CARD (Requirement 13) -->
          ${
            oppMandi
              ? `
            <div class="card market-opportunity-card">
              <div class="opp-badge-label">
                ${Icons.sparkles("icon-xs")}
                <span>HIGHER GROSS RATE NEARBY</span>
              </div>

              <div class="opp-main-row">
                <div class="opp-info">
                  <h3 class="opp-mandi-name">${oppMandi.name}</h3>
                  <div class="opp-mandi-stats">
                    <span class="opp-gross-rate">₹${oppMandi.pricePerQ.toLocaleString("en-IN")}/q</span>
                    <span class="bullet">•</span>
                    <span class="opp-distance">${Icons.mapPin("icon-xxs")} ${oppMandi.distanceKm} km away</span>
                    <span class="bullet">•</span>
                    <span class="opp-transport">${Icons.truck("icon-xxs")} Est. transport: ₹${oppMandi.estTransportPerQ}/q</span>
                  </div>
                </div>

                <div class="opp-calc-summary">
                  <div class="opp-net-box">
                    <span class="opp-net-label">Estimated Net Realisation</span>
                    <span class="opp-net-val">₹${oppNet ? oppNet.netRatePerQ : oppMandi.pricePerQ - oppMandi.estTransportPerQ}/q</span>
                    <span class="opp-diff ${netDiff >= 0 ? 'text-positive' : 'text-amber'}">
                      ${netDiff >= 0 ? `+₹${netDiff}/q net gain` : `Transport offsets gross gain`}
                    </span>
                  </div>
                </div>
              </div>

              <div class="opp-footer">
                <p class="opp-explanation">
                  Gross price is ₹${oppMandi.pricePerQ - primaryMandi.pricePerQ}/q higher. After estimated transit of ₹${oppMandi.estTransportPerQ}/q, net difference is <strong>${netDiff >= 0 ? `+₹${netDiff}/q` : `-₹${Math.abs(netDiff)}/q`}</strong>.
                </p>
                <button class="btn btn-secondary btn-sm" onclick="window.AgriNova.navigate('market')">
                  ${Icons.market("icon-xs")}
                  <span>${store.t("compareMarkets")}</span>
                </button>
              </div>
            </div>
          `
              : ""
          }

          <!-- RECENT ACTIVITY (Requirement 17) -->
          <div class="card dashboard-activity-card">
            <div class="card-header-compact">
              <h3 class="card-title-sm">${store.t("recentActivity")}</h3>
              <span class="text-subtle text-xs">Past 7 days</span>
            </div>
            <div class="activity-feed-list">
              ${state.recentActivity
                .slice(0, 4)
                .map((act) => {
                  let actIcon = Icons.info("feed-icon");
                  if (act.type === "offer") actIcon = Icons.sell("feed-icon text-accent");
                  if (act.type === "price") actIcon = Icons.trendingUp("feed-icon text-primary");
                  if (act.type === "payment") actIcon = Icons.money("feed-icon text-positive");
                  if (act.type === "task") actIcon = Icons.checkCircle("feed-icon text-primary");

                  return `
                    <div class="activity-feed-item">
                      <div class="activity-icon-bubble">${actIcon}</div>
                      <div class="activity-details">
                        <div class="act-title-row">
                          <span class="act-title">${act.title}</span>
                          <span class="act-time">${act.time}</span>
                        </div>
                        <p class="act-desc">${act.desc}</p>
                      </div>
                    </div>
                  `;
                })
                .join("")}
            </div>
          </div>
        </div>

        <!-- Right Column: Tasks, Weather, Farm Health (Requirements 14, 15, 16) -->
        <div class="dashboard-right-col">
          
          <!-- UPCOMING TASKS (Requirement 14) -->
          <div class="card tasks-card">
            <div class="card-header-compact">
              <div>
                <span class="eyebrow-subtle">FARM CONTEXT</span>
                <h3 class="card-title-sm">Upcoming Field Tasks</h3>
              </div>
              <button class="btn-link text-xs" onclick="window.AgriNova.navigate('farmcare')">
                ${store.t("viewAllTasks")} →
              </button>
            </div>

            <div class="task-compact-list">
              ${
                pendingTasks.length > 0
                  ? pendingTasks
                      .map(
                        (task) => `
                    <div class="task-compact-item" onclick="window.AgriNova.toggleTask('${task.id}')">
                      <div class="task-check-circle ${task.status === 'COMPLETED' ? 'checked' : ''}">
                        ${task.status === 'COMPLETED' ? Icons.check("icon-xxs") : ""}
                      </div>
                      <div class="task-compact-info">
                        <span class="task-compact-title">${task.title}</span>
                        <div class="task-compact-meta">
                          <span class="task-badge-cat">${task.category}</span>
                          <span class="bullet">•</span>
                          <span class="task-due-date">${Icons.calendar("icon-xxs")} ${task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  `
                      )
                      .join("")
                  : `<div class="empty-hint">All scheduled field tasks up to date.</div>`
              }
            </div>
          </div>

          <!-- WEATHER IMPACT (Requirement 15) -->
          <div class="card weather-card">
            <div class="card-header-compact">
              <div>
                <span class="eyebrow-subtle">MICRO-CLIMATE</span>
                <h3 class="card-title-sm">Weather & Farm Implications</h3>
              </div>
              <span class="weather-temp-badge">${state.weather.tempC}°C</span>
            </div>

            <div class="weather-row-summary">
              <div class="weather-cond-chip">
                ${Icons.cloudRain("icon-sm text-accent")}
                <span>${state.weather.condition}</span>
              </div>
              <div class="weather-stat-chip">
                <span>Rain: <strong>${state.weather.rainProbabilityPercent}%</strong></span>
              </div>
              <div class="weather-stat-chip">
                <span>Wind: <strong>${state.weather.windKmh} km/h</strong></span>
              </div>
            </div>

            <!-- Agricultural Implications (Requirement 15: Not a generic weather app!) -->
            <div class="agri-implication-box">
              <div class="implication-header">
                ${Icons.alertTriangle("icon-xs text-amber")}
                <strong>Agricultural Consideration:</strong>
              </div>
              <p class="implication-text">
                "${state.weather.implications.harvesting} ${state.weather.implications.transport}"
              </p>
            </div>
          </div>

          <!-- FARM HEALTH (Requirement 16) -->
          <div class="card farm-health-card">
            <div class="card-header-compact">
              <div>
                <span class="eyebrow-subtle">CROP VITALITY</span>
                <h3 class="card-title-sm">${store.t("farmHealth")}</h3>
              </div>
              <div class="health-score-display">
                <span class="score-large">${state.farmHealth.overallScore}</span>
                <span class="score-base">/ 100</span>
              </div>
            </div>

            <div class="health-breakdown-list">
              ${state.farmHealth.components
                .map(
                  (c) => `
                <div class="health-item">
                  <div class="health-meta-row">
                    <span class="health-item-name">${c.name}</span>
                    <span class="health-item-score">${c.score}/100</span>
                  </div>
                  <div class="health-progress-track">
                    <div class="health-progress-fill" style="width: ${c.score}%;"></div>
                  </div>
                  <span class="health-item-status">${c.status}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>

        </div>
      </div>

    </div>
  `;
}
