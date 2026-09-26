/**
 * AgriNova Platform - My Farm View
 * Farm Profile, Active Crops, Add Crop with Auto-Sync, and Harvest-to-Market Timeline.
 * (Requirements 41–44, 71, 75, 96)
 */

import { Icons } from "./icons.js";
import { store } from "../state/store.js";

export function renderFarm(state) {
  const farmer = state.farmer;
  const crops = state.crops;

  return `
    <div class="farm-view-container animate-fade-in">
      
      <!-- Page Header (Requirement 41) -->
      <div class="farm-page-header">
        <div>
          <span class="eyebrow-accent">LEVEL 2 — FARM CONTEXT</span>
          <h1 class="page-title-main">My Farm & Crops</h1>
          <p class="page-subtitle">Track land holdings, crop growth stages, and connect cultivation cycles with market windows.</p>
        </div>

        <div class="header-actions-group">
          <button class="btn btn-primary btn-sm" onclick="window.AgriNova.openAddCropModal()">
            ${Icons.plus("icon-xs")}
            <span>Add New Crop</span>
          </button>
        </div>
      </div>

      <!-- Farm Overview Card (Requirement 42) -->
      <div class="card farm-overview-card">
        <div class="farm-overview-header">
          <div class="farmer-id-badge">
            <div class="avatar-box">${farmer.avatar}</div>
            <div>
              <h3 class="farm-owner-name">${farmer.name}'s Farm</h3>
              <span class="farm-location-sub">${farmer.village}, ${farmer.taluk}, ${farmer.district}, ${farmer.state}</span>
            </div>
          </div>

          <div class="kyc-verified-pill">
            ${Icons.checkCircle("icon-xs text-primary")}
            <span>Land & KYC Verified</span>
          </div>
        </div>

        <div class="farm-stats-grid">
          <div class="f-stat-box">
            <span class="f-lbl">Total Land Area</span>
            <span class="f-val">${farmer.farmSizeAcres} Acres</span>
            <span class="f-sub">${farmer.landOwnership}</span>
          </div>
          <div class="f-stat-box">
            <span class="f-lbl">Irrigation Source</span>
            <span class="f-val">${farmer.irrigationType}</span>
            <span class="f-sub">Canal Turn: Alternate Thu</span>
          </div>
          <div class="f-stat-box">
            <span class="f-lbl">Farming Experience</span>
            <span class="f-val">${farmer.farmingExperienceYears} Years</span>
            <span class="f-sub">Continuous Organic Transition</span>
          </div>
          <div class="f-stat-box">
            <span class="f-lbl">Cooperative Affiliation</span>
            <span class="f-val text-sm font-semibold">${farmer.fpoMembership}</span>
            <span class="f-sub">Eligible for FPO aggregation</span>
          </div>
        </div>
      </div>

      <!-- HARVEST-TO-MARKET TIMELINE (Requirement 75) -->
      <div class="card harvest-timeline-card">
        <div class="card-header">
          <div>
            <span class="eyebrow-accent">CONNECTING FARM & MARKET</span>
            <h3 class="card-title-md">Harvest-to-Market Timeline</h3>
            <p class="card-subtitle-sub">Understand market price conditions matching your projected harvest window</p>
          </div>
        </div>

        <div class="h-timeline-stages">
          <div class="h-stage completed">
            <div class="h-marker">${Icons.check("icon-xxs")}</div>
            <div class="h-content">
              <span class="h-title">Sowing & Transplanting</span>
              <span class="h-date">12 Aug 2026</span>
              <span class="h-note">Paddy (BPT 5204) established</span>
            </div>
          </div>

          <div class="h-stage in-progress">
            <div class="h-marker">●</div>
            <div class="h-content">
              <span class="h-title">Grain Filling Stage (Current)</span>
              <span class="h-date">Late Sep 2026</span>
              <span class="h-note">Top-dressing fertilizer applied</span>
            </div>
          </div>

          <div class="h-stage upcoming">
            <div class="h-marker">3</div>
            <div class="h-content">
              <span class="h-title">Expected Harvest Date</span>
              <span class="h-date">15 Nov 2026</span>
              <span class="h-note">Projected Yield: ~50 Quintals</span>
            </div>
          </div>

          <div class="h-stage market-linked">
            <div class="h-marker">${Icons.market("icon-xxs")}</div>
            <div class="h-content">
              <span class="h-title">Target Selling Window</span>
              <span class="h-date">18–25 Nov 2026</span>
              <span class="h-note">Estimated Rate: ₹2,950–₹3,050/q</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Crops Management (Requirement 43) -->
      <div class="card active-crops-card">
        <div class="card-header">
          <div>
            <span class="eyebrow-subtle">CROP INVENTORY</span>
            <h3 class="card-title-lg">Active Cultivated Crops</h3>
          </div>
          <span class="text-xs text-subtle">${crops.length} Active Crops in Rotation</span>
        </div>

        <div class="crops-list-grid">
          ${crops
            .map((crop) => {
              const isSelected = state.selectedCropId === crop.id;
              const comm = state.commodities[crop.id] || state.commodities["paddy"];

              return `
              <div class="crop-detail-card ${isSelected ? 'selected-crop' : ''}">
                <div class="crop-card-top">
                  <div>
                    <div class="crop-title-row">
                      <h4 class="crop-name-title">${crop.name}</h4>
                      ${isSelected ? `<span class="active-focus-badge">Current Focus</span>` : ""}
                    </div>
                    <span class="crop-variety-sub">Variety: ${crop.variety} • ${crop.areaAcres} acres</span>
                  </div>
                  <div class="crop-health-score">
                    <span class="score-num">${crop.healthScore}</span>
                    <span class="score-lbl">Health</span>
                  </div>
                </div>

                <div class="crop-cycle-strip">
                  <div class="cycle-bar-track">
                    <div class="cycle-bar-fill" style="width: ${Math.round((crop.growthDays / crop.totalCycleDays) * 100)}%;"></div>
                  </div>
                  <div class="cycle-dates-row">
                    <span>Sown: ${crop.cultivationDate}</span>
                    <span class="font-semibold">Harvest: ${crop.expectedHarvest}</span>
                  </div>
                </div>

                <div class="crop-specs-row">
                  <div class="c-spec">
                    <span class="c-lbl">Estimated Yield:</span>
                    <span class="c-val">${crop.expectedQuantityQuintals} quintals</span>
                  </div>
                  <div class="c-spec">
                    <span class="c-lbl">Benchmark Rate:</span>
                    <span class="c-val font-semibold">₹${comm.currentPrice.toLocaleString("en-IN")}/q</span>
                  </div>
                  <div class="c-spec">
                    <span class="c-lbl">Est. Produce Value:</span>
                    <span class="c-val text-primary font-bold">₹${(crop.expectedQuantityQuintals * comm.currentPrice).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div class="crop-actions-row">
                  <button 
                    class="btn btn-outline btn-xs" 
                    onclick="window.AgriNova.setCrop('${crop.id}'); window.AgriNova.navigate('market');"
                  >
                    ${Icons.market("icon-xxs")}
                    <span>View Market Rates</span>
                  </button>
                  <button 
                    class="btn btn-secondary btn-xs" 
                    onclick="window.AgriNova.setCrop('${crop.id}'); window.AgriNova.navigate('sell');"
                  >
                    ${Icons.sell("icon-xxs")}
                    <span>List for Buyers</span>
                  </button>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>

      <!-- Farmer Market Profile (Requirement 71) -->
      <div class="card farmer-market-profile-card">
        <div class="card-header-compact">
          <div>
            <span class="eyebrow-accent">BUYER MATCHING PREFERENCES</span>
            <h3 class="card-title-sm">Farmer Market Profile</h3>
          </div>
        </div>

        <div class="pref-items-grid">
          <div class="pref-item">
            <span class="pref-lbl">Preferred Selling Radius:</span>
            <span class="pref-val">Up to 100 km (Kanchipuram, Tindivanam, Vellore)</span>
          </div>
          <div class="pref-item">
            <span class="pref-lbl">Payment Mode Preference:</span>
            <span class="pref-val">Direct Bank Transfer (NEFT/RTGS) within 24h</span>
          </div>
          <div class="pref-item">
            <span class="pref-lbl">Transport Flexibility:</span>
            <span class="pref-val">Can arrange local lorry or prefer farmgate pickup</span>
          </div>
          <div class="pref-item">
            <span class="pref-lbl">Quality Certification:</span>
            <span class="pref-val">Standard FAQ Moisture Tested</span>
          </div>
        </div>
      </div>

    </div>
  `;
}
