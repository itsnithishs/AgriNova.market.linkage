/**
 * AgriNova Platform - Modals & Form Dialogs
 * Create Listing, Add Crop, Price Alert, Buyer Offer Inspection & Auth Preview (Requirements 33, 36, 44, 70).
 */

import { Icons } from "./icons.js";
import { UI } from "./ui.js";
import { store } from "../state/store.js";

export function renderModals(state) {
  const commodity = store.getCurrentCommodity();
  const selectedMandi = store.getCurrentMandi();

  return `
    <!-- 1. CREATE LISTING MODAL (Requirement 36) -->
    ${UI.renderModal(
      "createListingModal",
      "Create Produce Listing for Buyers",
      `
      <form id="createListingForm" onsubmit="window.AgriNova.handleCreateListing(event)">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Crop Name</label>
            <select name="cropId" class="form-select" required>
              <option value="paddy" selected>Paddy (Rice)</option>
              <option value="groundnut">Groundnut</option>
              <option value="wheat">Wheat</option>
              <option value="cotton">Cotton</option>
              <option value="tomato">Tomato</option>
              <option value="maize">Maize</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Variety</label>
            <input type="text" name="variety" class="form-input" value="BPT 5204 (Samba Mahsuri)" required />
          </div>

          <div class="form-group">
            <label class="form-label">Quality Grade</label>
            <select name="grade" class="form-select">
              <option value="FAQ (Fair Average Quality)" selected>FAQ (Moisture <14.5%)</option>
              <option value="Grade A">Grade A (Premium Milling)</option>
              <option value="Organic Certified">Organic Certified</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Quantity Available (Quintals)</label>
            <input type="number" name="quantityQuintals" class="form-input" value="${state.quantityQuintals}" min="1" max="10000" required />
          </div>

          <div class="form-group">
            <label class="form-label">Expected Price (₹ / quintal)</label>
            <input type="number" name="expectedPricePerQ" class="form-input" value="${commodity.currentPrice}" min="500" required />
          </div>

          <div class="form-group">
            <label class="form-label">Available Date for Dispatch</label>
            <input type="text" name="availableDate" class="form-input" value="18 Nov 2026" required />
          </div>

          <div class="form-group full-width">
            <label class="form-label">Produce Location (Village / Mandi Yard)</label>
            <input type="text" name="location" class="form-input" value="${state.farmer.village}, ${state.farmer.district}" required />
          </div>

          <div class="form-group full-width">
            <label class="form-label">Quality Notes & Sample Photos</label>
            <div class="file-upload-simulator">
              ${Icons.fileText("icon-sm text-subtle")}
              <span>Click to attach photos or moisture slip (optional)</span>
            </div>
          </div>
        </div>

        <div class="modal-actions-bar">
          <button type="button" class="btn btn-outline" onclick="window.AgriNova.closeModal('createListingModal')">Cancel</button>
          <button type="submit" class="btn btn-primary">Publish Produce Listing</button>
        </div>
      </form>
    `
    )}

    <!-- 2. ADD CROP MODAL (Requirement 44: Auto-syncs to dashboard, market, farmcare) -->
    ${UI.renderModal(
      "addCropModal",
      "Add Crop to Farm Registry",
      `
      <form id="addCropForm" onsubmit="window.AgriNova.handleAddCrop(event)">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Select Crop</label>
            <select name="name" class="form-select" required>
              <option value="Paddy" selected>Paddy (Rice)</option>
              <option value="Groundnut">Groundnut</option>
              <option value="Wheat">Wheat</option>
              <option value="Cotton">Cotton</option>
              <option value="Tomato">Tomato</option>
              <option value="Maize">Maize</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Variety / Hybrid</label>
            <input type="text" name="variety" class="form-input" placeholder="e.g. Sona Masoori, PKM 1" required />
          </div>

          <div class="form-group">
            <label class="form-label">Cultivated Land (Acres)</label>
            <input type="number" step="0.1" name="areaAcres" class="form-input" value="2.0" min="0.1" max="50" required />
          </div>

          <div class="form-group">
            <label class="form-label">Cultivation Date</label>
            <input type="date" name="cultivationDate" class="form-input" value="2026-09-01" required />
          </div>

          <div class="form-group">
            <label class="form-label">Expected Harvest Date</label>
            <input type="text" name="expectedHarvest" class="form-input" value="20 Dec 2026" required />
          </div>

          <div class="form-group">
            <label class="form-label">Estimated Output (Quintals)</label>
            <input type="number" name="expectedQuantityQuintals" class="form-input" value="25" min="1" required />
          </div>
        </div>

        <div class="modal-sync-notice">
          ${Icons.info("icon-xs text-primary")}
          <span>Adding this crop automatically updates your Dashboard, Market Intelligence, and FarmCare calendars without duplicate data entry.</span>
        </div>

        <div class="modal-actions-bar">
          <button type="button" class="btn btn-outline" onclick="window.AgriNova.closeModal('addCropModal')">Cancel</button>
          <button type="submit" class="btn btn-primary">Save & Synchronize Crop</button>
        </div>
      </form>
    `
    )}

    <!-- 3. CREATE PRICE ALERT MODAL (Requirement 33) -->
    ${UI.renderModal(
      "priceAlertModal",
      "Create Price Alert",
      `
      <form id="priceAlertForm" onsubmit="window.AgriNova.handleCreateAlert(event)">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Crop Name</label>
            <input type="text" name="cropName" class="form-input" value="${commodity.name}" readonly />
          </div>

          <div class="form-group">
            <label class="form-label">Alert Trigger Condition</label>
            <select name="condition" class="form-select">
              <option value="Crosses Above">Crosses Above (Price Spike)</option>
              <option value="Falls Below">Falls Below (Price Drop Alert)</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Target Trigger Price (₹ / quintal)</label>
            <input type="number" name="targetPrice" class="form-input" value="${commodity.currentPrice + 100}" min="500" required />
            <span class="text-xs text-subtle d-block mt-1">Current modal benchmark is ₹${selectedMandi.pricePerQ}/q.</span>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Notification Channels</label>
            <select name="notifyVia" class="form-select">
              <option value="SMS & In-App">SMS to ${state.farmer.phone} & In-App Alert</option>
              <option value="In-App Only">In-App Notification Only</option>
            </select>
          </div>
        </div>

        <div class="modal-actions-bar">
          <button type="button" class="btn btn-outline" onclick="window.AgriNova.closeModal('priceAlertModal')">Cancel</button>
          <button type="submit" class="btn btn-primary">Set Alert</button>
        </div>
      </form>
    `
    )}

    <!-- 4. SCHEDULE FIELD TASK MODAL (Requirement 48) -->
    ${UI.renderModal(
      "addTaskModal",
      "Schedule FarmCare Field Task",
      `
      <form id="addTaskForm" onsubmit="window.AgriNova.handleAddTask(event)">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Task Category</label>
            <select name="category" class="form-select" required>
              <option value="Fertilizer">Fertilizer Application</option>
              <option value="Irrigation">Irrigation / Sluice Check</option>
              <option value="Weed Management">Weed Management</option>
              <option value="Crop Care">Crop Health & Micronutrient</option>
              <option value="Harvest Preparation">Harvest Preparation</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Crop Associated</label>
            <select name="cropName" class="form-select" required>
              ${state.crops.map((c) => `<option value="${c.name}">${c.name}</option>`).join("")}
            </select>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Task Title</label>
            <input type="text" name="title" class="form-input" placeholder="e.g. Apply Zinc Sulphate top-dress" required />
          </div>

          <div class="form-group">
            <label class="form-label">Target Due Date</label>
            <input type="text" name="dueDate" class="form-input" value="03 Oct 2026" required />
          </div>

          <div class="form-group">
            <label class="form-label">Urgency Level</label>
            <select name="urgency" class="form-select">
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High (Time-Sensitive)</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Field Instructions / Dosage</label>
            <textarea name="instructions" class="form-textarea" rows="2" placeholder="e.g. Ensure standing water is at 2 inches before application."></textarea>
          </div>
        </div>

        <div class="modal-actions-bar">
          <button type="button" class="btn btn-outline" onclick="window.AgriNova.closeModal('addTaskModal')">Cancel</button>
          <button type="submit" class="btn btn-primary">Schedule Task</button>
        </div>
      </form>
    `
    )}

    <!-- 5. AUTHENTICATION & LOGIN PREVIEW MODAL (Requirement 70) -->
    ${UI.renderModal(
      "authModal",
      "AgriNova Farmer Authentication",
      `
      <div class="auth-modal-content">
        <div class="auth-tabs">
          <button type="button" class="auth-tab-btn active" id="authTabLogin" onclick="window.AgriNova.switchAuthTab('login')">Farmer Login</button>
          <button type="button" class="auth-tab-btn" id="authTabRegister" onclick="window.AgriNova.switchAuthTab('register')">Register New Account</button>
        </div>

        <div id="authLoginSection">
          <p class="text-xs text-subtle mb-3">Sign in securely with your mobile number and one-time password (OTP).</p>
          <div class="form-group mb-3">
            <label class="form-label">Mobile Number</label>
            <div class="input-with-prefix">
              <span class="prefix">+91</span>
              <input type="tel" class="form-input" value="${state.farmer.phone.replace('+91 ', '')}" />
            </div>
          </div>
          <button type="button" class="btn btn-primary w-full" onclick="window.AgriNova.showToast('OTP sent to your mobile: 4829', 'success')">
            Get 4-Digit OTP
          </button>
        </div>

        <div id="authRegisterSection" style="display: none;">
          <p class="text-xs text-subtle mb-3">Register your farm holding to receive transport-aware net value calculations.</p>
          <div class="form-grid">
            <div class="form-group"><label class="form-label">Full Name</label><input type="text" class="form-input" placeholder="e.g. Ravi Kumar" /></div>
            <div class="form-group"><label class="form-label">Mobile</label><input type="tel" class="form-input" placeholder="98421 XXXXX" /></div>
            <div class="form-group"><label class="form-label">District</label><input type="text" class="form-input" value="Tiruvannamalai" /></div>
            <div class="form-group"><label class="form-label">Land (Acres)</label><input type="number" class="form-input" value="4.5" /></div>
          </div>
          <button type="button" class="btn btn-primary w-full mt-3" onclick="window.AgriNova.showToast('Registration successful! Welcome to AgriNova.', 'success'); window.AgriNova.closeModal('authModal');">
            Create Farmer Account
          </button>
        </div>
      </div>
    `
    )}

    <!-- 6. BUYER OFFER INSPECTION MODAL -->
    ${UI.renderModal(
      "buyerOfferModal",
      "Buyer Purchase Order Details",
      `
      <div id="buyerOfferModalBody">
        <p class="text-sm">Loading buyer terms...</p>
      </div>
    `
    )}
  `;
}
