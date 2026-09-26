/**
 * AgriNova Platform - Account & Settings View
 * Language switcher, Security & OTP protocols, Login History, Notification preferences, Privacy & Terms (Req 63–70).
 */

import { Icons } from "./icons.js";
import { store } from "../state/store.js";
import { SUPPORTED_LANGUAGES } from "../data/i18n.js";

export function renderSettings(state) {
  const currentLang = state.currentLanguage;
  const loginHistory = state.loginHistory;

  return `
    <div class="settings-view-container animate-fade-in">
      
      <!-- Settings Header (Requirement 63) -->
      <div class="settings-page-header">
        <div>
          <span class="eyebrow-accent">LEVEL 4 — CONFIGURATION & PRIVACY</span>
          <h1 class="page-title-main">Account & Settings</h1>
          <p class="page-subtitle">Configure regional language preferences, account security, notification alerts, and data privacy.</p>
        </div>
      </div>

      <div class="settings-layout-grid">
        
        <!-- SECTION 1: LANGUAGE SELECTION (Requirement 64) -->
        <div class="card settings-card">
          <div class="card-header-compact">
            <div>
              <span class="eyebrow-subtle">LANGUAGE & LOCALIZATION</span>
              <h3 class="card-title-md">Preferred Platform Language</h3>
            </div>
          </div>

          <div class="language-selection-grid">
            ${SUPPORTED_LANGUAGES.map(
              (l) => `
              <div 
                class="lang-card-option ${currentLang === l.code ? 'selected' : ''}" 
                onclick="window.AgriNova.setLanguage('${l.code}')"
              >
                <div class="lang-check-circle">
                  ${currentLang === l.code ? Icons.check("icon-xxs") : ""}
                </div>
                <div class="lang-names">
                  <span class="lang-native font-semibold">${l.nativeName}</span>
                  <span class="lang-en text-xs text-subtle">${l.label}</span>
                </div>
              </div>
            `
            ).join("")}
          </div>
        </div>

        <!-- SECTION 2: SECURITY & OTP SIMULATION (Requirement 65) -->
        <div class="card settings-card">
          <div class="card-header-compact">
            <div>
              <span class="eyebrow-subtle">AUTHENTICATION & SESSIONS</span>
              <h3 class="card-title-md">Security & Access Management</h3>
            </div>
            <span class="badge-status-pill text-positive">2-Factor OTP Enabled</span>
          </div>

          <div class="security-controls-list">
            <div class="sec-row">
              <div>
                <strong>Primary Mobile Number</strong>
                <span class="text-xs text-subtle d-block">${state.farmer.phone} (OTP verified)</span>
              </div>
              <button class="btn btn-outline btn-xs" onclick="window.AgriNova.openOtpModal()">Change Number / Verify</button>
            </div>

            <div class="sec-row">
              <div>
                <strong>Account Password</strong>
                <span class="text-xs text-subtle d-block">Last changed 45 days ago</span>
              </div>
              <button class="btn btn-outline btn-xs" onclick="window.AgriNova.showToast('Password reset link sent to registered SMS.', 'info')">Update Password</button>
            </div>

            <div class="sec-row">
              <div>
                <strong>Authentication Flow Preview</strong>
                <span class="text-xs text-subtle d-block">Preview the clean login & registration modal</span>
              </div>
              <button class="btn btn-secondary btn-xs" onclick="window.AgriNova.openAuthModal()">Preview Login Modal</button>
            </div>
          </div>
        </div>

        <!-- SECTION 3: LOGIN HISTORY (Requirement 66) -->
        <div class="card settings-card">
          <div class="card-header-compact">
            <div>
              <span class="eyebrow-subtle">AUDIT TRAIL</span>
              <h3 class="card-title-md">Recent Login Sessions</h3>
            </div>
            <span class="text-xs text-subtle">Demo Audit Records</span>
          </div>

          <div class="login-history-list">
            ${loginHistory
              .map((sess) => {
                const isCurrent = sess.status === "ACTIVE_CURRENT";
                return `
                <div class="login-sess-item">
                  <div class="sess-icon-wrap">
                    ${isCurrent ? Icons.shield("icon-xs text-positive") : Icons.user("icon-xs text-subtle")}
                  </div>
                  <div class="sess-info">
                    <div class="sess-title-row">
                      <strong class="sess-device">${sess.device}</strong>
                      ${isCurrent ? `<span class="current-session-tag">Active Session</span>` : ""}
                    </div>
                    <span class="sess-meta text-xs text-subtle">
                      ${sess.location} • IP: ${sess.ip} • ${sess.dateTime}
                    </span>
                  </div>
                  ${
                    !isCurrent
                      ? `
                    <button class="btn-link text-xs text-danger" onclick="window.AgriNova.showToast('Session terminated.', 'info')">
                      Sign Out
                    </button>
                  `
                      : ""
                  }
                </div>
              `;
              })
              .join("")}
          </div>
        </div>

        <!-- SECTION 4: NOTIFICATION PREFERENCES (Requirement 69) -->
        <div class="card settings-card">
          <div class="card-header-compact">
            <div>
              <span class="eyebrow-subtle">ALERTS & CHANNELS</span>
              <h3 class="card-title-md">Notification Preferences</h3>
            </div>
          </div>

          <div class="notification-toggles-list">
            <div class="notif-toggle-row">
              <div>
                <strong>Mandi Price Spike / Drop Alerts</strong>
                <span class="text-xs text-subtle d-block">Instant SMS & app ping when your target crop crosses target price</span>
              </div>
              <label class="switch-ui"><input type="checkbox" checked><span class="slider-round"></span></label>
            </div>

            <div class="notif-toggle-row">
              <div>
                <strong>Verified Buyer Offers & Inquiries</strong>
                <span class="text-xs text-subtle d-block">Direct notification when a local mill or aggregator submits an offer</span>
              </div>
              <label class="switch-ui"><input type="checkbox" checked><span class="slider-round"></span></label>
            </div>

            <div class="notif-toggle-row">
              <div>
                <strong>Heavy Rainfall & Transport Advisories</strong>
                <span class="text-xs text-subtle d-block">Early warning 48h before rains that may cause transit or drying delays</span>
              </div>
              <label class="switch-ui"><input type="checkbox" checked><span class="slider-round"></span></label>
            </div>

            <div class="notif-toggle-row">
              <div>
                <strong>Direct Bank Settlement Confirmations</strong>
                <span class="text-xs text-subtle d-block">Credit alerts when weighbridge receipts are cleared</span>
              </div>
              <label class="switch-ui"><input type="checkbox" checked><span class="slider-round"></span></label>
            </div>
          </div>
        </div>

        <!-- SECTION 5: PRIVACY & DATA RIGHTS (Requirement 67) -->
        <div class="card settings-card">
          <div class="card-header-compact">
            <div>
              <span class="eyebrow-subtle">DATA GOVERNANCE</span>
              <h3 class="card-title-md">Privacy & Farmer Ownership</h3>
            </div>
          </div>

          <div class="privacy-statement-box">
            <p class="text-sm">
              AgriNova is built on the strict principle that <strong>your farm data belongs to you</strong>. 
              We collect your land holding acreage, crop schedule, and primary mandi preferences solely to compute realisable net returns and filter matching buyers.
            </p>
            <ul class="privacy-points-list text-xs text-subtle">
              <li>• Bank account digits are masked and never exposed to prospective buyers until you explicitly confirm a contract.</li>
              <li>• Weighbridge slips and transaction histories are never sold to external third-party advertisers.</li>
              <li>• You can request full data export or deletion of your profile at any time.</li>
            </ul>
          </div>
        </div>

        <!-- SECTION 6: TERMS & LEGAL TRANSPARENCY (Requirement 68) -->
        <div class="card settings-card">
          <div class="card-header-compact">
            <div>
              <span class="eyebrow-subtle">TERMS OF SERVICE</span>
              <h3 class="card-title-md">Transparency & Advisory Terms</h3>
            </div>
          </div>

          <div class="terms-statement-box text-xs text-subtle">
            <p>
              AgriNova provides comparative mandi prices, freight estimations, and trend indicators for decision support.
              All final sales contracts, weighments, and grading agreements take place directly between the farmer and the verified buyer or APMC licensed trader.
              AgriNova does not provide absolute financial guarantees on speculative future price movements.
            </p>
          </div>
        </div>

      </div>

    </div>
  `;
}
