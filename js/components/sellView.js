/**
 * AgriNova Platform - Sell to Buyers View
 * Direct Buyer Discovery, Transparent Match Score (Req 38), Listing Creation,
 * Offer Comparison, and Sale Confirmation Timeline (Requirements 35–40, 78, 95).
 */

import { Icons } from "./icons.js";
import { UI } from "./ui.js";
import { store } from "../state/store.js";

export function renderSell(state) {
  const commodity = store.getCurrentCommodity();
  const listings = state.listings;
  const activeListing = listings[0] || null;
  const buyers = state.potentialBuyers.filter((b) => b.cropId === state.selectedCropId);
  const offers = state.offers.filter((o) => !activeListing || o.listingId === activeListing.id);

  // Status timeline steps (Requirement 40)
  const timelineSteps = [
    { id: "DRAFT", label: "Draft" },
    { id: "PUBLISHED", label: "Published" },
    { id: "INTEREST", label: "Buyer Interest" },
    { id: "OFFER_RECEIVED", label: "Offer Received" },
    { id: "SALE_CONFIRMED", label: "Sale Confirmed" },
    { id: "COMPLETED", label: "Completed" }
  ];

  const currentStatus = activeListing ? activeListing.status : "DRAFT";
  const currentStepIdx = timelineSteps.findIndex((s) => s.id === currentStatus);

  return `
    <div class="sell-view-container animate-fade-in">
      
      <!-- Page Header (Requirement 35) -->
      <div class="sell-page-header">
        <div>
          <span class="eyebrow-accent">LEVEL 1 — DIRECT MARKET LINKAGE</span>
          <h1 class="page-title-main">Sell to Buyers</h1>
          <p class="page-subtitle">Connect your harvest directly with verified millers, bulk aggregators, and institutional procurers.</p>
        </div>

        <div class="header-actions-group">
          <button class="btn btn-primary btn-sm" onclick="window.AgriNova.openListingModal()">
            ${Icons.plus("icon-xs")}
            <span>Create New Produce Listing</span>
          </button>
        </div>
      </div>

      <!-- Selling Readiness Checklist Strip (Requirement 78) -->
      <div class="readiness-checklist-strip">
        <div class="readiness-header">
          <span class="readiness-title">${Icons.checkCircle("icon-xs text-primary")} Selling Readiness Checklist</span>
          <span class="readiness-sub text-xs">Verify your lot parameters for faster buyer acceptance</span>
        </div>
        <div class="readiness-items-grid">
          <div class="readiness-item checked">
            ${Icons.check("icon-xxs")}
            <span>Harvest Date Estimated (15 Nov)</span>
          </div>
          <div class="readiness-item checked">
            ${Icons.check("icon-xxs")}
            <span>Quantity Available (50 Quintals)</span>
          </div>
          <div class="readiness-item checked">
            ${Icons.check("icon-xxs")}
            <span>FAQ Moisture Grade Known (<14.5%)</span>
          </div>
          <div class="readiness-item checked">
            ${Icons.check("icon-xxs")}
            <span>Verified Bank Account Connected</span>
          </div>
        </div>
      </div>

      <!-- Active Produce Listing & Timeline (Requirements 36 & 40) -->
      ${
        activeListing
          ? `
        <div class="card active-listing-card">
          <div class="card-header">
            <div>
              <span class="eyebrow-subtle">CURRENT ACTIVE LISTING</span>
              <h3 class="card-title-md">${activeListing.quantityQuintals}q ${activeListing.cropName} (${activeListing.variety})</h3>
              <span class="text-xs text-subtle">Listed from: ${activeListing.location} • Target Rate: ₹${activeListing.expectedPricePerQ}/q</span>
            </div>
            <div class="listing-badge-group">
              <span class="badge-status-pill">${activeListing.status.replace("_", " ")}</span>
            </div>
          </div>

          <!-- Visual Status Timeline (Requirement 40) -->
          <div class="listing-timeline-wrap">
            <div class="timeline-bar">
              ${timelineSteps
                .map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return `
                  <div class="timeline-node ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}">
                    <div class="node-circle">
                      ${isDone ? Icons.check("icon-xxs") : idx + 1}
                    </div>
                    <span class="node-label">${step.label}</span>
                  </div>
                `;
                })
                .join("")}
            </div>
          </div>

          <!-- Active Listing Stats Strip -->
          <div class="listing-quick-metrics">
            <div class="l-metric">
              <span class="l-metric-lbl">Buyer Inquiries</span>
              <span class="l-metric-val">${activeListing.viewsCount} views</span>
            </div>
            <div class="l-metric">
              <span class="l-metric-lbl">Verified Offers</span>
              <span class="l-metric-val highlight">${offers.length} active offers</span>
            </div>
            <div class="l-metric">
              <span class="l-metric-lbl">Target Delivery Window</span>
              <span class="l-metric-val">${activeListing.availableDate}</span>
            </div>
            <div class="l-metric">
              <span class="l-metric-lbl">Quality Specification</span>
              <span class="l-metric-val">${activeListing.grade}</span>
            </div>
          </div>
        </div>
      `
          : `
        <div class="card p-6">
          ${UI.renderEmptyState(
            "sell",
            "No Active Produce Listing",
            "Create a listing for your current crop to get matched with verified buyers in your radius.",
            "Create Listing Now",
            "window.AgriNova.openListingModal()"
          )}
        </div>
      `
      }

      <!-- BUYER OFFER COMPARISON (Requirements 39 & 95) -->
      ${
        offers.length > 0
          ? `
        <div class="card buyer-offers-comparison-card">
          <div class="card-header">
            <div>
              <span class="eyebrow-accent">OFFER EVALUATION</span>
              <h3 class="card-title-lg">Compare Incoming Buyer Offers</h3>
              <p class="card-subtitle-sub">Compare offer rates side-by-side with transport deduction and payment terms</p>
            </div>
          </div>

          <div class="offers-grid">
            ${offers
              .map((offer) => {
                const isConfirmed = offer.status === "SALE_CONFIRMED";
                return `
                <div class="offer-card ${isConfirmed ? 'confirmed' : ''}">
                  <div class="offer-card-top">
                    <div>
                      <h4 class="offer-buyer-title">${offer.buyerName}</h4>
                      <span class="offer-pickup-tag">${Icons.truck("icon-xxs")} ${offer.pickupOption}</span>
                    </div>
                    <div class="offer-price-tag">
                      <span class="offer-price-num">₹${offer.offerPricePerQ.toLocaleString("en-IN")}</span>
                      <span class="offer-price-unit">/ quintal</span>
                    </div>
                  </div>

                  <div class="offer-specs-grid">
                    <div class="o-spec">
                      <span class="o-lbl">Gross Value:</span>
                      <span class="o-val font-semibold">₹${offer.grossAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div class="o-spec">
                      <span class="o-lbl">Transport Freight:</span>
                      <span class="o-val ${offer.totalTransportCost === 0 ? 'text-positive' : 'text-subtle'}">
                        ${offer.totalTransportCost === 0 ? 'FREE (Buyer Farmgate Pickup)' : `-₹${offer.totalTransportCost.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                    <div class="o-spec">
                      <span class="o-lbl">Handling & Loading:</span>
                      <span class="o-val">-₹${offer.estLoadingHandling.toLocaleString("en-IN")}</span>
                    </div>
                    <div class="o-spec highlight">
                      <span class="o-lbl">Est. Take-Home Realisation:</span>
                      <span class="o-val font-bold text-primary">₹${offer.estNetRealisation.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div class="offer-terms-block">
                    <span class="terms-title">${Icons.shield("icon-xxs")} Payment Terms:</span>
                    <p class="terms-text">${offer.paymentTerms}</p>
                    <span class="notes-text">"${offer.notes}"</span>
                  </div>

                  <div class="offer-card-footer">
                    <span class="text-xs text-subtle">Offer valid until ${offer.validTill}</span>
                    ${
                      isConfirmed
                        ? `
                      <span class="sale-confirmed-badge">
                        ${Icons.checkCircle("icon-xs")}
                        <span>Sale Confirmed</span>
                      </span>
                    `
                        : `
                      <button 
                        class="btn btn-primary btn-sm" 
                        onclick="window.AgriNova.acceptOffer('${offer.id}')"
                      >
                        ${Icons.check("icon-xs")}
                        <span>Confirm Sale (${store.t("confirmSale")})</span>
                      </button>
                    `
                    }
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>
        </div>
      `
          : ""
      }

      <!-- POTENTIAL BUYER MATCHING (Requirements 37 & 38: TRANSPARENT MATCH SCORE) -->
      <div class="card potential-buyers-card">
        <div class="card-header">
          <div>
            <span class="eyebrow-accent">DIRECT MARKET ACCESS</span>
            <h3 class="card-title-lg">Matching Institutional & Mill Buyers</h3>
            <p class="card-subtitle-sub">Buyers currently looking for ${commodity.name} in Tamil Nadu & surrounding districts</p>
          </div>
          <div class="demo-tag">
            ${UI.dataStatusBadge("VERIFIED BUYER DIRECTORY")}
          </div>
        </div>

        <div class="buyers-catalog-list">
          ${
            buyers.length > 0
              ? buyers
                  .map(
                    (buyer) => `
                <div class="buyer-match-card">
                  <div class="buyer-main-info">
                    <div class="buyer-header-line">
                      <h4 class="buyer-company-name">${buyer.companyName}</h4>
                      ${UI.verifiedBuyerBadge(buyer.verificationStatus)}
                    </div>
                    <div class="buyer-sub-meta">
                      <span>${buyer.category}</span>
                      <span class="bullet">•</span>
                      <span>${buyer.location} (${buyer.distanceKm} km away)</span>
                      <span class="bullet">•</span>
                      <span>Procuring: ${buyer.minQtyTonnes}–${buyer.maxQtyTonnes} tonnes</span>
                    </div>

                    <div class="buyer-requirement-box">
                      <span class="req-title">Quality Required:</span>
                      <span class="req-desc">${buyer.gradeRequired}</span>
                    </div>

                    <!-- "Why This Match?" (Requirement 38) -->
                    <div class="why-match-accordion">
                      <span class="why-match-label">
                        ${Icons.info("icon-xxs text-primary")}
                        <strong>Why this match?</strong>
                      </span>
                      <ul class="why-match-list">
                        ${buyer.whyMatch.map((reason) => `<li>${reason}</li>`).join("")}
                      </ul>
                    </div>
                  </div>

                  <div class="buyer-commercial-col">
                    ${UI.matchScoreBadge(buyer.matchScore)}

                    <div class="buyer-offer-badge">
                      <span class="b-offer-lbl">Indicative Purchase Rate</span>
                      <span class="b-offer-num">₹${buyer.offerPricePerQ.toLocaleString("en-IN")}/q</span>
                      <span class="b-offer-diff font-semibold">${buyer.baseMandiDiff}</span>
                    </div>

                    <div class="buyer-actions">
                      <button 
                        class="btn btn-outline btn-sm" 
                        onclick="window.AgriNova.openBuyerOfferModal('${buyer.id}')"
                      >
                        <span>View Buyer Offer</span>
                      </button>
                      <button 
                        class="btn btn-primary btn-sm" 
                        onclick="window.AgriNova.contactBuyer('${buyer.companyName}')"
                      >
                        <span>Connect Directly</span>
                      </button>
                    </div>
                  </div>
                </div>
              `
                  )
                  .join("")
              : `
              <div class="p-6">
                ${UI.renderEmptyState(
                  "user",
                  "No Matching Buyers Currently Listed",
                  `No private buyers currently have active orders for ${commodity.name}. Check nearby regulated mandis or create a listing.`,
                  "Browse Mandis",
                  "window.AgriNova.navigate('market')"
                )}
              </div>
            `
          }
        </div>
      </div>

    </div>
  `;
}
