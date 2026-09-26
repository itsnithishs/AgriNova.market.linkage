/**
 * AgriNova Platform - Level 3 Support Views
 * Government Schemes, Financial Support Services, and Agricultural Knowledge Hub (Requirements 53–55).
 */

import { Icons } from "./icons.js";
import { UI } from "./ui.js";

// Government Support View (Requirement 53)
export function renderGovernmentSupport(state) {
  const schemes = state.governmentSupport;

  return `
    <div class="support-view-container animate-fade-in">
      <div class="view-header">
        <span class="eyebrow-accent">LEVEL 3 — WELFARE & INFRASTRUCTURE</span>
        <h1 class="page-title-main">Government Support Schemes</h1>
        <p class="page-subtitle">Discovered and filtered for farmers in ${state.farmer.state}. Verified against official portal standards.</p>
      </div>

      <div class="schemes-catalog-grid">
        ${schemes
          .map(
            (s) => `
          <div class="card scheme-card">
            <div class="scheme-card-header">
              <div>
                <span class="scheme-cat-pill">${s.category}</span>
                <h3 class="scheme-title">${s.title}</h3>
              </div>
              <span class="badge-official">
                ${Icons.landmark("icon-xxs")} Official
              </span>
            </div>

            <div class="scheme-body">
              <div class="scheme-benefit-box">
                <span class="s-lbl">Scheme Benefit:</span>
                <p class="s-benefit-text">${s.benefit}</p>
              </div>

              <div class="scheme-eligibility-box">
                <span class="s-lbl">Eligibility Summary:</span>
                <p class="s-eligibility-text">${s.eligibilitySummary}</p>
              </div>

              <div class="scheme-status-strip">
                <span class="s-lbl">Farmer Enrolment Status:</span>
                <span class="s-status-tag font-semibold">${s.farmerStatus}</span>
              </div>
            </div>

            <div class="scheme-footer">
              <span class="text-xs text-subtle">Scope: ${s.scope} • ${s.state}</span>
              <a href="${s.officialSourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-xs">
                <span>Official Portal</span>
                ${Icons.externalLink ? Icons.externalLink("icon-xxs") : "↗"}
              </a>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

// Financial Support View (Requirement 54)
export function renderFinancialSupport(state) {
  const financial = state.financialSupport;

  return `
    <div class="support-view-container animate-fade-in">
      <div class="view-header">
        <span class="eyebrow-accent">LEVEL 3 — CREDIT & WAREHOUSE LIQUIDITY</span>
        <h1 class="page-title-main">Financial Support & Loans</h1>
        <p class="page-subtitle">Low-interest agricultural credit, warehouse receipt pledge liquidity, and distress sale prevention.</p>
      </div>

      <div class="financial-services-grid">
        ${financial
          .map(
            (fin) => `
          <div class="card fin-card">
            <div class="fin-card-header">
              <div class="fin-icon-wrap">${Icons.money("icon-md")}</div>
              <div>
                <h3 class="fin-title">${fin.title}</h3>
                <span class="fin-inst text-xs text-subtle">${fin.institution}</span>
              </div>
            </div>

            <div class="fin-body">
              <div class="fin-benefit-box">
                <span class="f-lbl">Facility & Benefit:</span>
                <p class="f-benefit-text">${fin.benefit}</p>
              </div>

              <div class="fin-guidance-box">
                <span class="f-lbl">Practical Guidance for Farmer:</span>
                <p class="f-guidance-text">${fin.guidance}</p>
              </div>
            </div>

            <div class="fin-footer">
              <button class="btn btn-secondary btn-xs" onclick="window.AgriNova.showToast('Connecting with bank liaison desk at ${state.farmer.district}...', 'info')">
                <span>Apply / Inquire Guidance</span>
              </button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

// Knowledge Base View (Requirement 55)
export function renderKnowledge(state) {
  const articles = state.knowledgeArticles;

  return `
    <div class="support-view-container animate-fade-in">
      <div class="view-header">
        <span class="eyebrow-accent">LEVEL 3 — FARMER KNOWLEDGE & ADVISORY</span>
        <h1 class="page-title-main">Knowledge & Best Practices</h1>
        <p class="page-subtitle">Practical guides on quality grading, moisture testing, transport negotiation, and post-harvest storage.</p>
      </div>

      <div class="knowledge-cards-grid">
        ${articles
          .map(
            (art) => `
          <div class="card kb-card">
            <div class="kb-header">
              <span class="kb-cat-tag">${art.category}</span>
              <span class="kb-read-time">${art.readingTime}</span>
            </div>
            <h3 class="kb-title">${art.title}</h3>
            <p class="kb-summary">${art.summary}</p>
            
            <div class="kb-expandable-content">
              <p class="kb-content-text">${art.content}</p>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

// Help & Support View (Requirement 6)
export function renderHelp(state) {
  return `
    <div class="support-view-container animate-fade-in">
      <div class="view-header">
        <span class="eyebrow-accent">FARMER ASSISTANCE</span>
        <h1 class="page-title-main">Help & Support Center</h1>
        <p class="page-subtitle">Get in touch with AgriNova market facilitators or local FPO representatives.</p>
      </div>

      <div class="help-cards-grid">
        <div class="card help-card">
          <div class="help-icon-wrap">${Icons.bot("icon-md text-primary")}</div>
          <h3 class="help-card-title">Ask AgriNova Assistant</h3>
          <p class="help-card-text">Ask anything about prices, freight calculations, or buyer requirements anytime.</p>
          <button class="btn btn-primary btn-sm" onclick="window.AgriNova.openAssistantWithContext()">Open Assistant</button>
        </div>

        <div class="card help-card">
          <div class="help-icon-wrap">${Icons.landmark("icon-md text-accent")}</div>
          <h3 class="help-card-title">District APMC Helpdesk</h3>
          <p class="help-card-text">Tiruvannamalai Regulated Market Committee Office: 04175-234892 (9 AM - 5 PM).</p>
          <button class="btn btn-outline btn-sm" onclick="window.AgriNova.showToast('Calling Tiruvannamalai Mandi Desk...', 'info')">Contact Mandi</button>
        </div>

        <div class="card help-card">
          <div class="help-icon-wrap">${Icons.user("icon-md text-primary")}</div>
          <h3 class="help-card-title">FPO Liaison Officer</h3>
          <p class="help-card-text">Mr. S. Ramesh, Lead Facilitator, Tiruvannamalai Farmers Producer Co-op.</p>
          <button class="btn btn-outline btn-sm" onclick="window.AgriNova.showToast('FPO Facilitator: +91 94432 18940', 'info')">View Number</button>
        </div>
      </div>
    </div>
  `;
}
