/**
 * AgriNova Platform - Main Application Controller & Orchestration
 * Coordinates store subscriptions, view routing, chart rendering, and user interactions.
 */

import { store } from "./state/store.js";
import { renderNavigation } from "./components/navigation.js";
import { renderDashboard } from "./components/dashboardView.js";
import { renderMarket } from "./components/marketView.js";
import { renderSell } from "./components/sellView.js";
import { renderFarm } from "./components/farmView.js";
import { renderFarmCare } from "./components/farmCareView.js";
import { renderMoney } from "./components/moneyView.js";
import { renderGovernmentSupport, renderFinancialSupport, renderKnowledge, renderHelp } from "./components/moreViews.js";
import { renderProfile } from "./components/profileView.js";
import { renderSettings } from "./components/settingsView.js";
import { renderAssistantDrawer } from "./components/assistantView.js";
import { renderModals } from "./components/modals.js";
import { UI } from "./components/ui.js";
import { PriceChart, generatePriceSeries } from "./charts/priceChart.js";
import { ForecastChart } from "./charts/forecastChart.js";
import { FinanceBarChart } from "./charts/financeChart.js";

class App {
  constructor() {
    this.priceChartInstance = null;
    this.forecastChartInstance = null;
    this.financeChartInstance = null;
    this.chartTabMode = "HISTORY"; // 'HISTORY' | 'FORECAST'

    this.initGlobalHandlers();
    this.mount();
    store.subscribe((state) => this.render(state));
  }

  mount() {
    this.render(store.state);
  }

  render(state) {
    const appShell = document.getElementById("app");
    if (!appShell) return;

    // 1. Render Navigation (Desktop sidebar + Mobile bottom bar)
    const { sidebarHtml, mobileBottomBarHtml } = renderNavigation(state);

    // 2. Render Main Active View
    let mainViewHtml = "";
    switch (state.currentView) {
      case "dashboard":
        mainViewHtml = renderDashboard(state);
        break;
      case "market":
        mainViewHtml = renderMarket({ ...state, chartTabMode: this.chartTabMode });
        break;
      case "sell":
        mainViewHtml = renderSell(state);
        break;
      case "farm":
        mainViewHtml = renderFarm(state);
        break;
      case "farmcare":
        mainViewHtml = renderFarmCare(state);
        break;
      case "money":
        mainViewHtml = renderMoney(state);
        break;
      case "more-gov":
        mainViewHtml = renderGovernmentSupport(state);
        break;
      case "more-fin":
        mainViewHtml = renderFinancialSupport(state);
        break;
      case "more-knowledge":
        mainViewHtml = renderKnowledge(state);
        break;
      case "more-profile":
        mainViewHtml = renderProfile(state);
        break;
      case "more-settings":
        mainViewHtml = renderSettings(state);
        break;
      case "more-help":
        mainViewHtml = renderHelp(state);
        break;
      default:
        mainViewHtml = renderDashboard(state);
    }

    // 3. Render Assistant Drawer & Modals
    const assistantHtml = renderAssistantDrawer(state);
    const modalsHtml = renderModals(state);
    const toastHtml = UI.renderToast(state.toast);

    // 4. Construct App Shell Layout
    appShell.innerHTML = `
      <div class="app-layout">
        ${sidebarHtml}
        <main class="app-main-viewport" id="mainViewport">
          <header class="top-compact-header">
            <div class="header-left">
              <span class="active-location-pill">
                📍 ${state.farmer.village}, ${state.farmer.district}
              </span>
            </div>
            <div class="header-right">
              <button class="header-assistant-btn" onclick="window.AgriNova.openAssistantWithContext()">
                🤖 <span>Ask AgriNova</span>
              </button>
            </div>
          </header>
          <div class="page-content-area">
            ${mainViewHtml}
          </div>
        </main>
      </div>
      ${mobileBottomBarHtml}
      ${assistantHtml}
      ${modalsHtml}
      <div id="toastContainer">${toastHtml}</div>
    `;

    // 5. Post-render Chart initialization
    this.initActiveCharts(state);
  }

  initActiveCharts(state) {
    if (state.currentView === "market") {
      const canvas = document.getElementById("marketMainCanvas");
      if (canvas) {
        const commodity = store.getCurrentCommodity();
        const mandi = store.getCurrentMandi();
        const series = generatePriceSeries(commodity, state.selectedTimeframe, mandi);

        if (this.chartTabMode === "HISTORY") {
          this.priceChartInstance = new PriceChart(canvas, {
            onPointClick: (pt) => this.handlePointClick(pt)
          });
          this.priceChartInstance.setData(series, commodity.historical30dAvg);
        } else {
          this.forecastChartInstance = new ForecastChart(canvas);
          this.forecastChartInstance.setData(series, commodity.forecast.periods, mandi.pricePerQ);
        }
      }
    }

    if (state.currentView === "money") {
      const fCanvas = document.getElementById("financeBarCanvas");
      if (fCanvas) {
        this.financeChartInstance = new FinanceBarChart(fCanvas);
        this.financeChartInstance.setData(state.finance.sales);
      }
    }
  }

  handlePointClick(pointData) {
    const callout = document.getElementById("pointSignalCallout");
    if (!callout) return;

    const titleEl = document.getElementById("calloutPointTitle");
    const priceEl = document.getElementById("calloutPointPrice");
    const changeEl = document.getElementById("calloutPointChange");
    const listEl = document.getElementById("calloutPointSignalsList");

    if (titleEl) titleEl.innerText = `${pointData.date} Market Conditions`;
    if (priceEl) priceEl.innerText = `₹${pointData.price.toLocaleString("en-IN")}/q`;
    if (changeEl) {
      changeEl.innerText = pointData.change >= 0 ? `+₹${pointData.change}` : `-₹${Math.abs(pointData.change)}`;
      changeEl.className = pointData.change >= 0 ? "callout-change-val text-positive" : "callout-change-val text-danger";
    }
    if (listEl) {
      listEl.innerHTML = pointData.possibleSignals.map((s) => `<li>• ${s}</li>`).join("");
    }

    callout.style.display = "block";
    callout.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  initGlobalHandlers() {
    window.AgriNova = {
      // Navigation
      navigate: (viewId) => store.navigate(viewId),
      toggleMoreMenu: () => store.toggleMoreMenu(),
      toggleMobileMoreSheet: () => {
        store.state.mobileMenuOpen = !store.state.mobileMenuOpen;
        store.emitChange();
      },

      // Language
      setLanguage: (lang) => store.setLanguage(lang),

      // Market controls
      setCrop: (cropId) => store.setCrop(cropId),
      setMandi: (mandiId) => store.setMandi(mandiId),
      setTimeframe: (tf) => store.setTimeframe(tf),
      setQuantity: (qty) => store.setQuantity(qty),
      setHandlingFee: (fee) => {
        store.state.handlingFeePerQ = Number(fee) || 0;
        store.emitChange();
      },
      setMandiFilterMode: (mode) => store.setMandiFilterMode(mode),
      setChartTabMode: (mode) => {
        this.chartTabMode = mode;
        store.emitChange();
      },

      // Modals
      openModal: (id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add("open");
      },
      closeModal: (id) => {
        const el = document.getElementById(id);
        if (el) el.classList.remove("open");
      },
      openListingModal: () => window.AgriNova.openModal("createListingModal"),
      openAddCropModal: () => window.AgriNova.openModal("addCropModal"),
      openAlertModal: () => window.AgriNova.openModal("priceAlertModal"),
      openAddTaskModal: () => window.AgriNova.openModal("addTaskModal"),
      openAuthModal: () => window.AgriNova.openModal("authModal"),
      openOtpModal: () => {
        store.showToast("OTP simulation: 4829 sent to registered phone.", "info");
      },
      switchAuthTab: (tab) => {
        const lSec = document.getElementById("authLoginSection");
        const rSec = document.getElementById("authRegisterSection");
        const lTab = document.getElementById("authTabLogin");
        const rTab = document.getElementById("authTabRegister");
        if (tab === "login") {
          if (lSec) lSec.style.display = "block";
          if (rSec) rSec.style.display = "none";
          if (lTab) lTab.classList.add("active");
          if (rTab) rTab.classList.remove("active");
        } else {
          if (lSec) lSec.style.display = "none";
          if (rSec) rSec.style.display = "block";
          if (lTab) lTab.classList.remove("active");
          if (rTab) rTab.classList.add("active");
        }
      },

      openBuyerOfferModal: (buyerId) => {
        const buyer = store.state.potentialBuyers.find((b) => b.id === buyerId);
        if (!buyer) return;
        const body = document.getElementById("buyerOfferModalBody");
        if (body) {
          body.innerHTML = `
            <div class="buyer-modal-details">
              <h4 class="font-bold text-lg mb-1">${buyer.companyName}</h4>
              <p class="text-xs text-subtle mb-3">${buyer.category} • ${buyer.location}</p>
              
              <div class="breakdown-line">
                <span>Indicative Purchase Offer</span>
                <strong class="text-primary font-bold text-lg">₹${buyer.offerPricePerQ}/q</strong>
              </div>
              <div class="breakdown-line">
                <span>Required Specification</span>
                <span>${buyer.gradeRequired}</span>
              </div>
              <div class="breakdown-line">
                <span>Procurement Lot Range</span>
                <span>${buyer.minQtyTonnes} – ${buyer.maxQtyTonnes} tonnes</span>
              </div>
              <div class="breakdown-line">
                <span>Settlement Terms</span>
                <span class="text-xs">${buyer.paymentTerms}</span>
              </div>

              <div class="modal-actions-bar mt-4">
                <button type="button" class="btn btn-outline" onclick="window.AgriNova.closeModal('buyerOfferModal')">Close</button>
                <button type="button" class="btn btn-primary" onclick="window.AgriNova.closeModal('buyerOfferModal'); window.AgriNova.contactBuyer('${buyer.companyName}')">Initiate Contact</button>
              </div>
            </div>
          `;
        }
        window.AgriNova.openModal("buyerOfferModal");
      },

      contactBuyer: (companyName) => {
        store.showToast(`Contact inquiry generated for ${companyName}. An AgriNova trade facilitator will connect you.`, "success");
      },

      // Form Submissions
      handleCreateListing: (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        store.createListing({
          cropId: fd.get("cropId"),
          variety: fd.get("variety"),
          grade: fd.get("grade"),
          quantityQuintals: fd.get("quantityQuintals"),
          expectedPricePerQ: fd.get("expectedPricePerQ"),
          availableDate: fd.get("availableDate"),
          location: fd.get("location")
        });
        window.AgriNova.closeModal("createListingModal");
        store.navigate("sell");
      },

      handleAddCrop: (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        store.addCrop({
          name: fd.get("name"),
          variety: fd.get("variety"),
          areaAcres: fd.get("areaAcres"),
          cultivationDate: fd.get("cultivationDate"),
          expectedHarvest: fd.get("expectedHarvest"),
          expectedQuantityQuintals: fd.get("expectedQuantityQuintals")
        });
        window.AgriNova.closeModal("addCropModal");
      },

      handleCreateAlert: (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        store.createAlert({
          cropName: fd.get("cropName"),
          condition: fd.get("condition"),
          targetPrice: fd.get("targetPrice"),
          notifyVia: fd.get("notifyVia")
        });
        window.AgriNova.closeModal("priceAlertModal");
      },

      handleAddTask: (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        store.addTask({
          category: fd.get("category"),
          cropName: fd.get("cropName"),
          title: fd.get("title"),
          dueDate: fd.get("dueDate"),
          urgency: fd.get("urgency"),
          instructions: fd.get("instructions")
        });
        window.AgriNova.closeModal("addTaskModal");
      },

      // Tasks & Offers
      toggleTask: (id) => store.toggleTask(id),
      acceptOffer: (id) => store.acceptOffer(id),
      toggleWatchlist: (item) => store.toggleWatchlist(item),
      toggleAlert: (id) => store.toggleAlert(id),

      // Assistant
      openAssistantWithContext: () => {
        store.state.activeDrawer = "assistant";
        store.emitChange();
      },
      closeDrawer: () => {
        store.state.activeDrawer = null;
        store.emitChange();
      },
      askAssistant: (q) => store.askAssistant(q),
      handleAssistantSubmit: (e) => {
        e.preventDefault();
        const input = document.getElementById("assistantQueryInput");
        if (input && input.value.trim()) {
          store.askAssistant(input.value.trim());
          input.value = "";
        }
      },

      // Toasts
      showToast: (msg, type) => store.showToast(msg, type),
      clearToast: () => store.clearToast()
    };

    // Keyboard support: Escape key closes active modals & drawer
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-backdrop.open").forEach((m) => m.classList.remove("open"));
        if (store.state.activeDrawer) {
          window.AgriNova.closeDrawer();
        }
        if (store.state.mobileMenuOpen) {
          window.AgriNova.toggleMobileMoreSheet();
        }
      }
    });
  }
}

// Instantiate on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
