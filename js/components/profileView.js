/**
 * AgriNova Platform - Farmer Profile View
 * Personal Details, Farm Registry, Masked Bank Information & Verified Documents (Requirements 59–62).
 */

import { Icons } from "./icons.js";
import { UI } from "./ui.js";

export function renderProfile(state) {
  const farmer = state.farmer;
  const bank = state.bankDetails;
  const docs = state.documents;

  return `
    <div class="profile-view-container animate-fade-in">
      
      <!-- Profile Header (Requirement 59) -->
      <div class="profile-page-header">
        <div>
          <span class="eyebrow-accent">LEVEL 4 — FARMER IDENTITY & TRUST</span>
          <h1 class="page-title-main">Farmer Profile & Records</h1>
          <p class="page-subtitle">Manage your verified identity, farm coordinates, banking details, and statutory documents.</p>
        </div>
      </div>

      <div class="profile-sections-stack">
        
        <!-- PERSONAL INFORMATION (Requirement 60) -->
        <div class="card profile-card">
          <div class="card-header">
            <div>
              <span class="eyebrow-subtle">SECTION 01</span>
              <h3 class="card-title-md">Personal Information</h3>
            </div>
            <span class="badge-status-pill text-positive">KYC Verified</span>
          </div>

          <div class="details-grid-two-col">
            <div class="detail-field">
              <span class="d-label">Full Name</span>
              <span class="d-val font-semibold">${farmer.name}</span>
            </div>
            <div class="detail-field">
              <span class="d-label">Registered Mobile (OTP Enabled)</span>
              <span class="d-val">${farmer.phone}</span>
            </div>
            <div class="detail-field">
              <span class="d-label">Email Address</span>
              <span class="d-val">${farmer.email}</span>
            </div>
            <div class="detail-field">
              <span class="d-label">Village & Taluk</span>
              <span class="d-val">${farmer.village}, ${farmer.taluk}</span>
            </div>
            <div class="detail-field">
              <span class="d-label">District & State</span>
              <span class="d-val">${farmer.district}, ${farmer.state} (PIN: ${farmer.pincode})</span>
            </div>
            <div class="detail-field">
              <span class="d-label">Primary Active Crop</span>
              <span class="d-val font-semibold">${state.commodities[state.selectedCropId]?.name || "Paddy"}</span>
            </div>
          </div>
        </div>

        <!-- BANK DETAILS (Requirement 61: MASKED SENSITIVE VALUES) -->
        <div class="card profile-card">
          <div class="card-header">
            <div>
              <span class="eyebrow-subtle">SECTION 02</span>
              <h3 class="card-title-md">Bank Account Details (For Buyer Direct Transfers)</h3>
              <p class="text-xs text-subtle">Used strictly for direct crediting of verified produce sales.</p>
            </div>
            <div class="badge-status-pill text-positive">
              ${Icons.shield("icon-xxs")} Verified for DBT / NEFT
            </div>
          </div>

          <div class="details-grid-two-col">
            <div class="detail-field">
              <span class="d-label">Bank Name</span>
              <span class="d-val font-semibold">${bank.bankName}</span>
            </div>
            <div class="detail-field">
              <span class="d-label">Branch</span>
              <span class="d-val">${bank.branch}</span>
            </div>
            <div class="detail-field">
              <span class="d-label">Account Number (Masked for Privacy)</span>
              <span class="d-val font-mono font-bold">${bank.accountNumberMasked}</span>
            </div>
            <div class="detail-field">
              <span class="d-label">IFSC Code</span>
              <span class="d-val font-mono">${bank.ifsc}</span>
            </div>
            <div class="detail-field">
              <span class="d-label">Account Holder Name</span>
              <span class="d-val font-semibold">${bank.holderName}</span>
            </div>
            <div class="detail-field">
              <span class="d-label">Linked UPI ID</span>
              <span class="d-val">${bank.upiId}</span>
            </div>
          </div>

          <div class="bank-security-footer">
            ${Icons.info("icon-xs text-accent")}
            <span>Sensitive account digits remain masked in accordance with banking data privacy standards.</span>
          </div>
        </div>

        <!-- STATUTORY DOCUMENTS (Requirement 62) -->
        <div class="card profile-card">
          <div class="card-header">
            <div>
              <span class="eyebrow-subtle">SECTION 03</span>
              <h3 class="card-title-md">Verified Land & Identity Documents</h3>
              <p class="text-xs text-subtle">Required to unlock high-volume direct buyer contracts and MSP procurement.</p>
            </div>
          </div>

          <div class="documents-list-grid">
            ${docs
              .map(
                (doc) => `
              <div class="doc-item-box">
                <div class="doc-icon-wrap">${Icons.fileText("icon-sm text-primary")}</div>
                <div class="doc-meta">
                  <h4 class="doc-title">${doc.title}</h4>
                  <span class="doc-num font-mono text-xs">${doc.numberMasked}</span>
                  <div class="doc-sub-line text-xs text-subtle">
                    <span>Uploaded: ${doc.uploadedDate}</span>
                    <span class="bullet">•</span>
                    <span>${doc.verifiedBy}</span>
                  </div>
                </div>
                <div class="doc-status-badge text-positive">
                  ${Icons.checkCircle("icon-xxs")} ${doc.status}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

      </div>

    </div>
  `;
}
