/**
 * AgriNova Platform - Money & Payments Tracking View
 * Total Sales, Received, Pending, Expected, Sales Records, and Clear Visual Ledger (Requirements 49–52).
 */

import { Icons } from "./icons.js";
import { store } from "../state/store.js";

export function renderMoney(state) {
  const finance = state.finance;
  const summary = finance.summary;
  const sales = finance.sales;

  return `
    <div class="money-view-container animate-fade-in">
      
      <!-- Page Header (Requirement 49) -->
      <div class="money-page-header">
        <div>
          <span class="eyebrow-accent">LEVEL 1 — TRANSACTIONAL REALISATION</span>
          <h1 class="page-title-main">Money & Payments</h1>
          <p class="page-subtitle">Track trade sales, direct bank transfers, pending dues, and expected harvest earnings.</p>
        </div>

        <div class="header-actions-group">
          <button class="btn btn-outline btn-sm" onclick="window.AgriNova.navigate('more-profile')">
            ${Icons.landmark("icon-xs")}
            <span>Bank Account Details</span>
          </button>
        </div>
      </div>

      <!-- Financial Metric Cards (Requirement 49) -->
      <div class="finance-metrics-strip">
        <div class="card f-metric-card">
          <span class="f-metric-label">${store.t("totalSales")} (Season)</span>
          <div class="f-metric-figure">
            <span class="curr">₹</span>
            <span class="amt">${summary.totalSalesThisSeason.toLocaleString("en-IN")}</span>
          </div>
          <span class="f-metric-sub text-xs">Total commercial trade bookings</span>
        </div>

        <div class="card f-metric-card highlight-green">
          <span class="f-metric-label">${store.t("received")} in Bank</span>
          <div class="f-metric-figure text-positive">
            <span class="curr">₹</span>
            <span class="amt">${summary.totalReceived.toLocaleString("en-IN")}</span>
          </div>
          <span class="f-metric-sub text-xs">Directly credited via NEFT/RTGS</span>
        </div>

        <div class="card f-metric-card highlight-amber">
          <span class="f-metric-label">${store.t("pending")} Realisation</span>
          <div class="f-metric-figure text-amber">
            <span class="curr">₹</span>
            <span class="amt">${summary.totalPending.toLocaleString("en-IN")}</span>
          </div>
          <span class="f-metric-sub text-xs">Under buyer 48-hr weighbridge clearance</span>
        </div>

        <div class="card f-metric-card">
          <span class="f-metric-label">${store.t("expected")} Next Harvest</span>
          <div class="f-metric-figure">
            <span class="curr">₹</span>
            <span class="amt">${summary.totalExpectedUpcoming.toLocaleString("en-IN")}</span>
          </div>
          <span class="f-metric-sub text-xs">Based on 50q Paddy @ ₹2,950/q net</span>
        </div>
      </div>

      <!-- Financial Chart & Cashflow Breakdown (Requirement 52) -->
      <div class="finance-summary-grid">
        <!-- Canvas Chart for Sales Breakdown -->
        <div class="card finance-chart-card">
          <div class="card-header">
            <div>
              <span class="eyebrow-subtle">INCOME DISTRIBUTION</span>
              <h3 class="card-title-md">Crop-wise Harvest Income</h3>
            </div>
            <span class="text-xs text-subtle">Sales in ₹ Thousands</span>
          </div>

          <div class="canvas-chart-viewport" style="height: 220px;">
            <canvas id="financeBarCanvas" height="220"></canvas>
          </div>

          <div class="chart-legend-row" style="margin-top: 10px;">
            <div class="legend-item">
              <span class="legend-color-box solid-green"></span>
              <span>Payment Received in Bank</span>
            </div>
            <div class="legend-item">
              <span class="legend-color-box corridor-amber"></span>
              <span>Pending Settlement</span>
            </div>
          </div>
        </div>

        <!-- Cashflow Health Card -->
        <div class="card cashflow-health-card">
          <div class="card-header-compact">
            <span class="eyebrow-accent">BANK SETTLEMENT GUARANTEE</span>
            <h3 class="card-title-sm">Payment Security Status</h3>
          </div>

          <div class="security-items-list">
            <div class="sec-item">
              <div class="sec-icon">${Icons.checkCircle("icon-xs text-positive")}</div>
              <div class="sec-info">
                <span class="sec-title">100% Transactions on Certified Slips</span>
                <span class="sec-desc text-xs text-subtle">All weight figures anchored to APMC weighbridge receipts.</span>
              </div>
            </div>

            <div class="sec-item">
              <div class="sec-icon">${Icons.shield("icon-xs text-primary")}</div>
              <div class="sec-info">
                <span class="sec-title">No Middleman Commission Deductions</span>
                <span class="sec-desc text-xs text-subtle">Direct miller payments bypass unverified commission cuts.</span>
              </div>
            </div>

            <div class="sec-item">
              <div class="sec-icon">${Icons.landmark("icon-xs text-accent")}</div>
              <div class="sec-info">
                <span class="sec-title">Bank Account Connected (SBI)</span>
                <span class="sec-desc text-xs text-subtle">A/C: ${state.bankDetails.accountNumberMasked}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales Ledger & Payment Tracking (Requirements 50 & 51) -->
      <div class="card sales-ledger-card">
        <div class="card-header">
          <div>
            <span class="eyebrow-accent">TRANSACTION HISTORY</span>
            <h3 class="card-title-lg">Crop Sales & Payment Ledger</h3>
            <p class="card-subtitle-sub">Individual buyer contracts and settlement tracking</p>
          </div>
        </div>

        <div class="table-responsive">
          <table class="sales-table">
            <thead>
              <tr>
                <th>Date & Invoice</th>
                <th>Crop & Quantity</th>
                <th>Buyer</th>
                <th>Rate / Quintal</th>
                <th>Gross Total</th>
                <th>Payment Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${sales
                .map((sale) => {
                  const isDone = sale.status === "COMPLETED";
                  return `
                  <tr>
                    <td>
                      <div class="inv-cell">
                        <strong>${sale.date}</strong>
                        <span class="text-xs text-subtle">${sale.invoiceNo}</span>
                      </div>
                    </td>
                    <td>
                      <div class="crop-cell">
                        <strong>${sale.cropName}</strong>
                        <span class="text-xs text-subtle">${sale.quantityQuintals} quintals</span>
                      </div>
                    </td>
                    <td>
                      <span class="buyer-cell font-semibold">${sale.buyerName}</span>
                    </td>
                    <td>
                      <span>₹${sale.ratePerQ.toLocaleString("en-IN")}/q</span>
                    </td>
                    <td>
                      <strong class="font-bold">₹${sale.grossAmount.toLocaleString("en-IN")}</strong>
                    </td>
                    <td>
                      <span class="text-xs">${sale.paymentMode}</span>
                    </td>
                    <td>
                      <span class="badge-payment ${isDone ? 'done' : 'pending'}">
                        ${isDone ? Icons.check("icon-xxs") : Icons.clock ? Icons.clock("icon-xxs") : "•"}
                        <span>${sale.status}</span>
                      </span>
                    </td>
                  </tr>
                `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}
