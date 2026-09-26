/**
 * AgriNova Platform - Reusable UI Components
 * Badges, Status Pills, Modals, Drawers, Toast Notifications, Skeletons, Empty States & Error States.
 */

import { Icons } from "./icons.js";

export const UI = {
  // Data Status Badge (Requirements 12 & 88)
  dataStatusBadge(status = "DEMO BENCHMARK DATA") {
    let cls = "badge-demo";
    if (status.includes("LIVE")) cls = "badge-live";
    else if (status.includes("UPDATED")) cls = "badge-updated";
    else if (status.includes("FORECAST")) cls = "badge-forecast";

    return `
      <span class="data-status-badge ${cls}" title="Data source transparency label">
        <span class="status-pulse-dot"></span>
        ${status}
      </span>
    `;
  },

  // Trend Badge (Positive / Negative / Neutral)
  trendBadge(change, percent = null) {
    const isPos = typeof change === "number" ? change >= 0 : String(change).startsWith("+");
    const icon = isPos ? Icons.trendingUp("badge-icon") : Icons.trendingDown("badge-icon");
    const cls = isPos ? "trend-up" : "trend-down";
    const text = typeof change === "number" ? (change >= 0 ? `+₹${change}` : `-₹${Math.abs(change)}`) : change;
    const pct = percent ? ` (${percent}%)` : "";

    return `
      <span class="trend-badge ${cls}">
        ${icon}
        <span>${text}${pct}</span>
      </span>
    `;
  },

  // Verified Buyer Badge
  verifiedBuyerBadge(status = "VERIFIED_BUYER") {
    if (status === "GOVT_DIRECT_DPC") {
      return `
        <span class="verified-badge govt">
          ${Icons.landmark("badge-icon")}
          <span>Govt DPC Verified</span>
        </span>
      `;
    }
    return `
      <span class="verified-badge">
        ${Icons.checkCircle("badge-icon")}
        <span>Verified Buyer</span>
      </span>
    `;
  },

  // Match Score Pill (Requirement 38)
  matchScoreBadge(score) {
    let colorClass = "score-high";
    if (score < 80) colorClass = "score-med";
    if (score < 70) colorClass = "score-low";

    return `
      <div class="match-score-pill ${colorClass}">
        <span class="score-number">${score}%</span>
        <span class="score-label">Match</span>
      </div>
    `;
  },

  // Skeleton Loader (Requirement 86)
  renderSkeleton(type = "card") {
    if (type === "chart") {
      return `
        <div class="skeleton-chart-box">
          <div class="skeleton-line" style="width: 40%; height: 24px; margin-bottom: 20px;"></div>
          <div class="skeleton-shimmer" style="height: 220px; border-radius: 8px;"></div>
        </div>
      `;
    }
    if (type === "table") {
      return `
        <div class="skeleton-table">
          <div class="skeleton-line" style="height: 38px; margin-bottom: 8px;"></div>
          <div class="skeleton-line" style="height: 38px; margin-bottom: 8px;"></div>
          <div class="skeleton-line" style="height: 38px;"></div>
        </div>
      `;
    }
    return `
      <div class="skeleton-card">
        <div class="skeleton-line" style="width: 50%; height: 18px; margin-bottom: 12px;"></div>
        <div class="skeleton-line" style="width: 85%; height: 14px; margin-bottom: 8px;"></div>
        <div class="skeleton-line" style="width: 65%; height: 14px;"></div>
      </div>
    `;
  },

  // Empty State Component (Requirement 85)
  renderEmptyState(iconName, title, message, actionBtnText = null, actionHandlerName = null) {
    const iconSvg = Icons[iconName] ? Icons[iconName]("empty-state-icon") : Icons.info("empty-state-icon");
    return `
      <div class="empty-state-container">
        <div class="empty-icon-wrapper">${iconSvg}</div>
        <h4 class="empty-state-title">${title}</h4>
        <p class="empty-state-message">${message}</p>
        ${
          actionBtnText
            ? `<button class="btn btn-primary btn-sm" onclick="${actionHandlerName}">
                 ${actionBtnText}
               </button>`
            : ""
        }
      </div>
    `;
  },

  // Error State Component (Requirement 87)
  renderErrorState(title = "Information unavailable", message = "Could not fetch current market signals. Please check connection.", retryHandlerName = "window.location.reload()") {
    return `
      <div class="error-state-container">
        <div class="error-icon-wrapper">${Icons.alertTriangle("error-icon")}</div>
        <h4 class="error-title">${title}</h4>
        <p class="error-message">${message}</p>
        <button class="btn btn-outline btn-sm" onclick="${retryHandlerName}">
          Try Again
        </button>
      </div>
    `;
  },

  // Modal Dialog Wrapper
  renderModal(modalId, title, contentHtml, footerHtml = "") {
    return `
      <div class="modal-backdrop" id="${modalId}" role="dialog" aria-modal="true" onclick="if(event.target === this) window.AgriNova.closeModal('${modalId}')">
        <div class="modal-panel animate-scale-up">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-close-btn" onclick="window.AgriNova.closeModal('${modalId}')" aria-label="Close modal">
              ${Icons.x("icon-sm")}
            </button>
          </div>
          <div class="modal-body">
            ${contentHtml}
          </div>
          ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ""}
        </div>
      </div>
    `;
  },

  // Toast container renderer
  renderToast(toast) {
    if (!toast) return "";
    let iconSvg = Icons.info("toast-icon");
    if (toast.type === "success") iconSvg = Icons.checkCircle("toast-icon success");
    if (toast.type === "warning") iconSvg = Icons.alertTriangle("toast-icon warning");

    return `
      <div class="toast-toast-notification animate-slide-in ${toast.type}">
        <div class="toast-icon-wrap">${iconSvg}</div>
        <span class="toast-text">${toast.message}</span>
        <button class="toast-close" onclick="window.AgriNova.clearToast()">
          ${Icons.x("icon-xs")}
        </button>
      </div>
    `;
  }
};
