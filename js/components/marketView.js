/**
 * AgriNova Platform - Market Intelligence View
 * The primary product core: Price Discovery, Dynamic Canvas Graph, AI Outlook,
 * Signals, Nearby Mandis, Net Value Calculator, Selling Window, Alerts & Watchlist.
 * (Requirements 18–34, 57, 72, 73, 74)
 */

import { Icons } from "./icons.js";
import { UI } from "./ui.js";
import { store } from "../state/store.js";

export function renderMarket(state) {
  const commodity = store.getCurrentCommodity();
  const selectedMandi = store.getCurrentMandi();
  const quantity = state.quantityQuintals;
  const netCalc = store.calculateNetValue(selectedMandi, quantity);

  // Sorting nearby mandis according to selected filter mode (Req 29)
  let mandis = [...(commodity.nearbyMandis || [])];
  if (state.mandiFilterMode === "HIGHEST_PRICE") {
    mandis.sort((a, b) => b.pricePerQ - a.pricePerQ);
  } else if (state.mandiFilterMode === "NEAREST") {
    mandis.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (state.mandiFilterMode === "RISING") {
    mandis.sort((a, b) => (b.trend === "rising" ? 1 : 0) - (a.trend === "rising" ? 1 : 0));
  } else if (state.mandiFilterMode === "AVAILABLE_BUYERS") {
    mandis.sort((a, b) => b.buyersCount - a.buyersCount);
  } else {
    // Default: BEST_NET_VALUE
    mandis.sort((a, b) => store.calculateNetValue(b).netRatePerQ - store.calculateNetValue(a).netRatePerQ);
  }

  // Active chart mode tab (History vs AI Forecast)
  const chartMode = state.chartTabMode || "HISTORY"; // 'HISTORY' | 'FORECAST'

  return `
    <div class="market-view-container animate-fade-in">
      
      <!-- Page Header (Requirement 18) -->
      <div class="market-page-header">
        <div>
          <span class="eyebrow-accent">LEVEL 1 — PRIMARY MARKET PRODUCT</span>
          <h1 class="page-title-main">Market Intelligence</h1>
          <p class="page-subtitle">Understand prices. Compare markets. Discover better selling opportunities.</p>
        </div>

        <div class="header-actions-group">
          <button class="btn btn-outline btn-sm" onclick="window.AgriNova.openAlertModal()">
            ${Icons.bell("icon-xs")}
            <span>Create Price Alert</span>
          </button>
          <button class="btn btn-accent btn-sm" onclick="window.AgriNova.openAssistantWithContext()">
            ${Icons.bot("icon-xs")}
            <span>Ask AgriNova About ${commodity.name}</span>
          </button>
        </div>
      </div>

      <!-- Market Filter Bar (Requirement 19: Clean, not complicated) -->
      <div class="market-filter-bar">
        <!-- Crop Select -->
        <div class="filter-item">
          <label class="filter-label">Crop</label>
          <select class="filter-select" onchange="window.AgriNova.setCrop(this.value)" aria-label="Select Crop">
            <option value="paddy" ${state.selectedCropId === "paddy" ? "selected" : ""}>Paddy (நெல் / धान)</option>
            <option value="wheat" ${state.selectedCropId === "wheat" ? "selected" : ""}>Wheat (கோதுமை / गेहूं)</option>
            <option value="groundnut" ${state.selectedCropId === "groundnut" ? "selected" : ""}>Groundnut (நிலக்கடலை / मूंगफली)</option>
            <option value="cotton" ${state.selectedCropId === "cotton" ? "selected" : ""}>Cotton (பருத்தி / कपास)</option>
            <option value="tomato" ${state.selectedCropId === "tomato" ? "selected" : ""}>Tomato (தக்காளி / टमाटर)</option>
            <option value="maize" ${state.selectedCropId === "maize" ? "selected" : ""}>Maize (மக்காச்சோளம் / मक्का)</option>
          </select>
        </div>

        <!-- Variety Select -->
        <div class="filter-item">
          <label class="filter-label">Variety</label>
          <select class="filter-select" aria-label="Select Variety">
            ${commodity.varieties.map((v) => `<option value="${v}">${v}</option>`).join("")}
          </select>
        </div>

        <!-- Grade Select -->
        <div class="filter-item">
          <label class="filter-label">Grade</label>
          <select class="filter-select" aria-label="Select Grade">
            ${commodity.grades.map((g) => `<option value="${g}">${g}</option>`).join("")}
          </select>
        </div>

        <!-- Benchmark Location / Mandi Select -->
        <div class="filter-item">
          <label class="filter-label">Primary Market</label>
          <select class="filter-select" onchange="window.AgriNova.setMandi(this.value)" aria-label="Select Mandi">
            ${commodity.nearbyMandis
              .map(
                (m) => `
              <option value="${m.id}" ${state.selectedMandiId === m.id ? "selected" : ""}>
                ${m.name} (${m.distanceKm} km • ₹${m.pricePerQ}/q)
              </option>
            `
              )
              .join("")}
          </select>
        </div>

        <!-- Quantity Input in Quintals -->
        <div class="filter-item qty-item">
          <label class="filter-label">Your Produce Quantity</label>
          <div class="qty-input-group">
            <input 
              type="number" 
              class="filter-input" 
              value="${quantity}" 
              min="1" 
              max="5000" 
              step="5"
              onchange="window.AgriNova.setQuantity(this.value)"
              aria-label="Produce Quantity in Quintals"
            />
            <span class="qty-unit-label">quintals (${(quantity * 100).toLocaleString("en-IN")} kg)</span>
          </div>
        </div>
      </div>

      <!-- Current Market Price Highlight Banner (Requirement 20) -->
      <div class="current-price-spotlight-card">
        <div class="spotlight-left">
          <div class="spotlight-header">
            <div class="spotlight-title-group">
              <span class="spotlight-kicker">BENCHMARK MODAL PRICE</span>
              <h2 class="spotlight-commodity">${commodity.name} at ${selectedMandi.name}</h2>
            </div>
            <div class="spotlight-badges">
              ${UI.dataStatusBadge(commodity.dataStatus)}
              <button 
                class="btn-bookmark ${store.isWatched(commodity.name, 'crop') ? 'active' : ''}" 
                onclick="window.AgriNova.toggleWatchlist({ id: '${commodity.name}', type: 'crop', label: '${commodity.name} - ${selectedMandi.name}', currentRate: '₹${selectedMandi.pricePerQ}/q' })"
                title="Save to Watchlist"
              >
                ${Icons.star("icon-xs")}
                <span>Watchlist</span>
              </button>
            </div>
          </div>

          <div class="spotlight-price-row">
            <div class="spotlight-price-figure">
              <span class="currency-symbol">₹</span>
              <span class="price-val-large">${selectedMandi.pricePerQ.toLocaleString("en-IN")}</span>
              <span class="unit-text">/ quintal</span>
            </div>
            <div class="spotlight-change-block">
              ${UI.trendBadge(commodity.change, commodity.changePercent)}
              <span class="change-subtext">vs previous market close</span>
            </div>
          </div>

          <div class="spotlight-range-grid">
            <div class="range-metric">
              <span class="range-lbl">Minimum Reported</span>
              <span class="range-val">₹${selectedMandi.minPrice.toLocaleString("en-IN")}</span>
            </div>
            <div class="range-metric highlight">
              <span class="range-lbl">Modal Benchmark</span>
              <span class="range-val">₹${selectedMandi.pricePerQ.toLocaleString("en-IN")}</span>
            </div>
            <div class="range-metric">
              <span class="range-lbl">Maximum Reported</span>
              <span class="range-val">₹${selectedMandi.maxPrice.toLocaleString("en-IN")}</span>
            </div>
            <div class="range-metric">
              <span class="range-lbl">Arrivals Today</span>
              <span class="range-val">${selectedMandi.arrivals || `${commodity.arrivalVolumeTonnes} tonnes`}</span>
            </div>
          </div>
        </div>

        <!-- 30-Day Trend Summary (Requirement 24) -->
        <div class="spotlight-right-summary">
          <h4 class="summary-box-title">30-Day Trend Summary</h4>
          <div class="trend-summary-row">
            <span class="trend-summary-label">30-Day Average:</span>
            <span class="trend-summary-val font-semibold">₹${commodity.historical30dAvg.toLocaleString("en-IN")}/q</span>
          </div>
          <div class="trend-summary-row">
            <span class="trend-summary-label">30-Day Movement:</span>
            <span class="trend-summary-val text-positive font-semibold">+2.8% (Rising)</span>
          </div>
          <div class="trend-summary-row">
            <span class="trend-summary-label">Market Velocity:</span>
            <span class="trend-summary-val">${commodity.trend}</span>
          </div>
          <div class="trend-summary-row">
            <span class="trend-summary-label">Govt MSP Floor:</span>
            <span class="trend-summary-val text-accent font-semibold">${commodity.mspPrice ? `₹${commodity.mspPrice.toLocaleString("en-IN")}/q` : "N/A"}</span>
          </div>

          <div class="trend-summary-footer">
            <span class="text-xs text-subtle">Last market sync: ${commodity.lastUpdated}</span>
          </div>
        </div>
      </div>

      <!-- Interactive Chart Section (Requirements 21, 22, 23, 25, 26) -->
      <div class="card chart-container-card">
        <div class="chart-header-controls">
          <div class="chart-tabs-switch">
            <button 
              class="chart-tab-btn ${chartMode === 'HISTORY' ? 'active' : ''}" 
              onclick="window.AgriNova.setChartTabMode('HISTORY')"
            >
              ${Icons.trendingUp("icon-xs")}
              <span>Historical Price Graph</span>
            </button>
            <button 
              class="chart-tab-btn ${chartMode === 'FORECAST' ? 'active' : ''}" 
              onclick="window.AgriNova.setChartTabMode('FORECAST')"
            >
              ${Icons.sparkles("icon-xs")}
              <span>AI Price Outlook Range</span>
            </button>
          </div>

          <!-- Timeframe selector buttons (7D | 30D | 3M | 6M | 1Y) - Requirement 21 -->
          ${
            chartMode === "HISTORY"
              ? `
            <div class="timeframe-button-group">
              ${["7D", "30D", "3M", "6M", "1Y"]
                .map(
                  (tf) => `
                <button 
                  class="tf-btn ${state.selectedTimeframe === tf ? 'active' : ''}" 
                  onclick="window.AgriNova.setTimeframe('${tf}')"
                >
                  ${tf}
                </button>
              `
                )
                .join("")}
            </div>
          `
              : `
            <div class="forecast-meta-pill">
              ${Icons.info("icon-xs text-accent")}
              <span>${commodity.forecast.modelConfidence} • Projected Range</span>
            </div>
          `
          }
        </div>

        <!-- Canvas Chart Mount Point -->
        <div class="canvas-chart-viewport" id="canvasChartViewport">
          <canvas id="marketMainCanvas" height="280"></canvas>
        </div>

        <!-- Selected Data Point Signals Callout (Requirement 23) -->
        <div class="point-signal-callout" id="pointSignalCallout" style="display: none;">
          <div class="callout-header">
            <div class="callout-title-row">
              ${Icons.info("icon-xs text-accent")}
              <h4 id="calloutPointTitle">Selected Date Market Signals</h4>
            </div>
            <button class="btn-icon-xs" onclick="document.getElementById('pointSignalCallout').style.display='none'">
              ${Icons.x("icon-xs")}
            </button>
          </div>
          <div class="callout-body">
            <div class="callout-stat">
              <span id="calloutPointPrice" class="callout-price-val">₹2,950/q</span>
              <span id="calloutPointChange" class="callout-change-val">+₹65</span>
            </div>
            <div class="callout-signals-box">
              <span class="callout-signals-label">Possible contributing factors:</span>
              <ul id="calloutPointSignalsList" class="callout-signals-list">
                <li>Lower mandi arrivals due to regional weather</li>
                <li>Increased mill procurement demand</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Chart Legend / Transparency Note -->
        <div class="chart-legend-row">
          <div class="legend-item">
            <span class="legend-color-box solid-green"></span>
            <span>Historical Mandi Rate</span>
          </div>
          <div class="legend-item">
            <span class="legend-color-box dashed-amber"></span>
            <span>30-Day Benchmark Avg (₹${commodity.historical30dAvg})</span>
          </div>
          ${
            chartMode === "FORECAST"
              ? `
            <div class="legend-item">
              <span class="legend-color-box corridor-amber"></span>
              <span>Forecast Confidence Corridor</span>
            </div>
          `
              : ""
          }
          <div class="legend-spacer"></div>
          <span class="legend-instruction">Click any chart data point to inspect contributing market signals.</span>
        </div>
      </div>

      <!-- AI Price Outlook Summary Cards (Requirement 25) -->
      <div class="card ai-forecast-ranges-card">
        <div class="card-header">
          <div>
            <span class="eyebrow-accent">FORWARD-LOOKING SIGNALS</span>
            <h3 class="card-title-md">AI Price Outlook (Estimated Ranges)</h3>
            <p class="text-xs text-subtle">
              Ranges calculated from multi-year seasonal arrivals, regional rainfall indicators, and mill procurement volumes.
              <strong>Never treated as financial certainty.</strong>
            </p>
          </div>
          <div class="forecast-status-tag">
            ${UI.dataStatusBadge("ESTIMATED FORECAST")}
          </div>
        </div>

        <div class="forecast-period-grid">
          ${commodity.forecast.periods
            .map(
              (p) => `
            <div class="forecast-period-box">
              <span class="period-label">${p.timeframe}</span>
              <span class="period-range">${p.range}</span>
              <div class="period-sentiment">
                <span class="sentiment-dot"></span>
                <span>${p.sentiment}</span>
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="forecast-disclaimer-bar">
          ${Icons.info("icon-xs text-amber")}
          <span>${commodity.forecast.disclaimer} Model updated: ${commodity.forecast.updatedAt}.</span>
        </div>
      </div>

      <!-- Market Signals Grid (Requirement 27) -->
      <div class="market-signals-section">
        <div class="section-title-strip">
          <div>
            <span class="eyebrow-subtle">MARKET CONTEXT</span>
            <h3 class="section-heading">Current Market Signals</h3>
          </div>
          <span class="text-xs text-subtle">5 Key Drivers Affecting Today's Price</span>
        </div>

        <div class="signals-cards-grid">
          ${commodity.signals
            .map((sig) => {
              let badgeCls = "badge-neutral";
              if (sig.status === "POSITIVE") badgeCls = "badge-positive";
              if (sig.status === "ATTENTION") badgeCls = "badge-attention";
              if (sig.status === "WARNING") badgeCls = "badge-warning";

              return `
              <div class="signal-card">
                <div class="signal-card-header">
                  <span class="signal-type-tag">${sig.title}</span>
                  <span class="signal-status-pill ${badgeCls}">${sig.status}</span>
                </div>
                <h4 class="signal-summary">${sig.summary}</h4>
                <p class="signal-explanation">${sig.explanation}</p>
                <div class="signal-footer">
                  <span class="signal-date">${sig.date}</span>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>

      <!-- NET REALISABLE VALUE CALCULATOR (Requirements 30 & 72: ONE OF THE STRONGEST FEATURES) -->
      <div class="card net-value-calculator-card" id="netValueCalculator">
        <div class="card-header">
          <div>
            <span class="eyebrow-accent">FROM MARKET PRICE TO REALISABLE VALUE</span>
            <h2 class="card-title-lg">Net Realisable Value Calculator</h2>
            <p class="card-subtitle-sub">
              Formula: <strong>Gross Produce Value − Estimated Selling & Transport Costs = Estimated Take-Home Net Value</strong>
            </p>
          </div>
          <div class="net-value-badge">
            ${Icons.truck("icon-xs")}
            <span>Transport-Aware Valuation</span>
          </div>
        </div>

        <div class="calculator-body-layout">
          <!-- Left: Parameters & Controls -->
          <div class="calc-inputs-pane">
            <div class="calc-field-group">
              <label class="calc-label">Selected Destination Market:</label>
              <select class="calc-select" onchange="window.AgriNova.setMandi(this.value)" aria-label="Select Target Mandi">
                ${commodity.nearbyMandis
                  .map(
                    (m) => `
                  <option value="${m.id}" ${selectedMandi.id === m.id ? "selected" : ""}>
                    ${m.name} — ${m.distanceKm} km (Gross ₹${m.pricePerQ}/q)
                  </option>
                `
                  )
                  .join("")}
              </select>
            </div>

            <div class="calc-field-group">
              <div class="label-with-val">
                <label class="calc-label">Produce Quantity:</label>
                <span class="slider-val-badge">${quantity} quintals</span>
              </div>
              <input 
                type="range" 
                class="calc-slider" 
                min="5" 
                max="250" 
                step="5" 
                value="${quantity}" 
                oninput="window.AgriNova.setQuantity(this.value)"
                aria-label="Quantity Slider"
              />
              <span class="slider-helper text-xs text-subtle">
                Equivalent to ${(quantity * 100).toLocaleString("en-IN")} kg (~${(quantity / 10).toFixed(1)} tonnes)
              </span>
            </div>

            <div class="calc-field-group">
              <div class="label-with-val">
                <label class="calc-label">Transit Distance:</label>
                <span class="slider-val-badge">${selectedMandi.distanceKm} km</span>
              </div>
              <p class="text-xs text-subtle">
                Estimated Lorry Transport Rate: ₹${netCalc.transportPerQ}/q (₹${(netCalc.transportPerQ / selectedMandi.distanceKm).toFixed(2)}/km/q).
              </p>
            </div>

            <div class="calc-field-group">
              <label class="calc-label">Handling, Weighbridge & Mandi Cess:</label>
              <div class="input-with-symbol">
                <span class="sym">₹</span>
                <input 
                  type="number" 
                  class="calc-input-sm" 
                  value="${netCalc.handlingPerQ}" 
                  onchange="window.AgriNova.setHandlingFee(this.value)" 
                  aria-label="Handling Fee per Quintal"
                />
                <span class="sym-unit">/ quintal</span>
              </div>
            </div>
          </div>

          <!-- Right: Transparent Itemized Breakdown (Requirement 30) -->
          <div class="calc-breakdown-pane">
            <h4 class="breakdown-title">Estimated Financial Realisation Breakdown</h4>
            
            <div class="breakdown-line">
              <div class="line-label">
                <span>Gross Produce Value</span>
                <span class="line-formula text-xs text-subtle">(${quantity}q × ₹${netCalc.pricePerQ}/q)</span>
              </div>
              <span class="line-amount gross">+₹${netCalc.grossValue.toLocaleString("en-IN")}</span>
            </div>

            <div class="breakdown-line deduction">
              <div class="line-label">
                <span>Estimated Transportation Freight</span>
                <span class="line-formula text-xs text-subtle">(${quantity}q × ₹${netCalc.transportPerQ}/q for ${netCalc.distanceKm} km)</span>
              </div>
              <span class="line-amount minus">-₹${netCalc.totalTransport.toLocaleString("en-IN")}</span>
            </div>

            <div class="breakdown-line deduction">
              <div class="line-label">
                <span>Estimated Handling, Bagging & Cess</span>
                <span class="line-formula text-xs text-subtle">(${quantity}q × ₹${netCalc.handlingPerQ}/q)</span>
              </div>
              <span class="line-amount minus">-₹${netCalc.totalHandling.toLocaleString("en-IN")}</span>
            </div>

            <div class="breakdown-divider"></div>

            <div class="breakdown-total-strip">
              <div class="total-label-block">
                <span class="total-label-kicker">ESTIMATED TAKE-HOME NET VALUE</span>
                <span class="total-rate-per-q">Effective Net Return: <strong>₹${netCalc.netRatePerQ.toLocaleString("en-IN")}/quintal</strong></span>
              </div>
              <div class="total-amount-box">
                <span class="net-rupee">₹</span>
                <span class="net-huge">${netCalc.netValue.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div class="breakdown-note">
              ${Icons.info("icon-xs text-primary")}
              <span>Transparent calculation. No hidden deductions or guaranteed profit claims. Realisation depends on quality grading upon delivery.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- SELLING WINDOW (Requirement 32: Neutral Contextual Interpretation) -->
      <div class="card selling-window-card">
        <div class="window-header">
          <div class="window-icon-badge">${Icons.calendar("icon-sm")}</div>
          <div class="window-title-block">
            <span class="eyebrow-accent">FARMER DECISION SUPPORT</span>
            <h3 class="card-title-md">Selling Window & Market Context</h3>
          </div>
        </div>

        <p class="window-statement">
          "${commodity.sellingWindow.summary}"
        </p>

        <div class="window-points-list">
          ${commodity.sellingWindow.contextPoints
            .map(
              (pt) => `
            <div class="window-point-item">
              ${Icons.checkCircle("icon-xs text-primary")}
              <span>${pt}</span>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="window-footer-disclaimer">
          <strong>Decision Principle:</strong> AgriNova provides comparative prices, freight costs, and signals. The final decision to sell or hold always belongs strictly to you.
        </div>
      </div>

      <!-- NEARBY MANDI COMPARISON (Requirements 28, 29, 31, 73) -->
      <div class="card nearby-mandis-card">
        <div class="card-header">
          <div>
            <span class="eyebrow-accent">SIDE-BY-SIDE MARKET COMPARISON</span>
            <h3 class="card-title-lg">Nearby Regulated Mandis</h3>
            <p class="card-subtitle-sub">Comparing 5 markets around Tiruvannamalai with estimated transport deduction</p>
          </div>

          <!-- Market Filter Options (Requirement 29) -->
          <div class="mandi-filter-pills">
            ${[
              { id: "BEST_NET_VALUE", label: "Best Net Value" },
              { id: "HIGHEST_PRICE", label: "Highest Price" },
              { id: "NEAREST", label: "Nearest" },
              { id: "RISING", label: "Rising Price" },
              { id: "AVAILABLE_BUYERS", label: "Most Buyers" }
            ]
              .map(
                (filter) => `
              <button 
                class="mandi-pill-btn ${state.mandiFilterMode === filter.id ? 'active' : ''}" 
                onclick="window.AgriNova.setMandiFilterMode('${filter.id}')"
              >
                ${filter.label}
              </button>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Desktop Mandi Comparison Table (Requirement 31 & 94) -->
        <div class="table-responsive mandi-table-wrap">
          <table class="mandi-comparison-table">
            <thead>
              <tr>
                <th>Market</th>
                <th>Gross Price</th>
                <th>Distance</th>
                <th>Est. Transport</th>
                <th>Est. Net Value (${quantity}q)</th>
                <th>Trend</th>
                <th>Buyers</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${mandis
                .map((m) => {
                  const mNet = store.calculateNetValue(m, quantity);
                  const isSelected = selectedMandi.id === m.id;
                  const isTopNet = mNet.netRatePerQ >= mandis[0]?.pricePerQ - mandis[0]?.estTransportPerQ - 30;

                  return `
                  <tr class="${isSelected ? 'row-selected' : ''} ${isTopNet ? 'row-top-net' : ''}">
                    <td>
                      <div class="mandi-name-cell">
                        <strong>${m.name}</strong>
                        <span class="mandi-sub-loc">${m.district}</span>
                      </div>
                    </td>
                    <td>
                      <span class="mandi-gross-price">₹${m.pricePerQ.toLocaleString("en-IN")}/q</span>
                      <span class="mandi-price-range text-xs text-subtle">(${m.minPrice} - ${m.maxPrice})</span>
                    </td>
                    <td>
                      <span class="mandi-distance-cell">${m.distanceKm} km</span>
                    </td>
                    <td>
                      <span class="mandi-freight-cell">₹${m.estTransportPerQ}/q</span>
                      <span class="text-xs text-subtle">Total: ₹${(m.estTransportPerQ * quantity).toLocaleString("en-IN")}</span>
                    </td>
                    <td>
                      <div class="mandi-net-result">
                        <span class="mandi-net-rate">₹${mNet.netRatePerQ.toLocaleString("en-IN")}/q</span>
                        <span class="mandi-net-total font-semibold">Total: ₹${mNet.netValue.toLocaleString("en-IN")}</span>
                      </div>
                    </td>
                    <td>
                      ${UI.trendBadge(m.change)}
                    </td>
                    <td>
                      <span class="buyers-count-tag">${m.buyersCount} Buyers</span>
                    </td>
                    <td>
                      <button 
                        class="btn ${isSelected ? 'btn-secondary' : 'btn-outline'} btn-xs" 
                        onclick="window.AgriNova.setMandi('${m.id}')"
                      >
                        ${isSelected ? 'Selected' : 'Select'}
                      </button>
                    </td>
                  </tr>
                `;
                })
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Mobile Stacked Mandi Cards (Requirement 94: Clean on Mobile) -->
        <div class="mobile-mandi-cards-stack">
          ${mandis
            .map((m) => {
              const mNet = store.calculateNetValue(m, quantity);
              const isSelected = selectedMandi.id === m.id;

              return `
              <div class="mobile-mandi-card ${isSelected ? 'selected' : ''}">
                <div class="m-card-top">
                  <div>
                    <h4 class="m-card-name">${m.name}</h4>
                    <span class="m-card-dist">${m.distanceKm} km away • ${m.district}</span>
                  </div>
                  <div class="m-card-gross">
                    <span class="m-gross-label">Gross Price</span>
                    <span class="m-gross-val">₹${m.pricePerQ.toLocaleString("en-IN")}/q</span>
                  </div>
                </div>

                <div class="m-card-mid-strip">
                  <div class="m-stat">
                    <span class="m-stat-lbl">Transport</span>
                    <span class="m-stat-val">₹${m.estTransportPerQ}/q</span>
                  </div>
                  <div class="m-stat">
                    <span class="m-stat-lbl">Trend</span>
                    <span class="m-stat-val">${m.change}</span>
                  </div>
                  <div class="m-stat highlight">
                    <span class="m-stat-lbl">Est. Net Value</span>
                    <span class="m-stat-val font-bold">₹${mNet.netRatePerQ}/q</span>
                  </div>
                </div>

                <div class="m-card-actions">
                  <span class="text-xs text-subtle">${m.buyersCount} buyers looking for ${commodity.name}</span>
                  <button 
                    class="btn ${isSelected ? 'btn-secondary' : 'btn-outline'} btn-xs" 
                    onclick="window.AgriNova.setMandi('${m.id}')"
                  >
                    ${isSelected ? 'Currently Selected' : 'Calculate For This Mandi'}
                  </button>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>

    </div>
  `;
}
