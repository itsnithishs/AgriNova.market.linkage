/**
 * AgriNova Platform - Desktop Sidebar & Mobile Navigation
 * Implements strict simple 7-item navigation architecture with in-place expandable More menu (Req 5, 6, 92, 93).
 */

import { Icons } from "./icons.js";
import { store } from "../state/store.js";

export function renderNavigation(state) {
  const current = state.currentView;
  const isMoreExpanded = state.moreMenuExpanded;
  const isMoreActive = ["more-gov", "more-fin", "more-knowledge", "more-profile", "more-settings", "more-help"].includes(current);

  const navItems = [
    { id: "dashboard", label: store.t("navDashboard"), icon: Icons.dashboard },
    { id: "market", label: store.t("navMarket"), icon: Icons.market, badge: "Live" },
    { id: "sell", label: store.t("navSell"), icon: Icons.sell, badge: "3" },
    { id: "farm", label: store.t("navFarm"), icon: Icons.farm },
    { id: "farmcare", label: store.t("navFarmCare"), icon: Icons.farmCare },
    { id: "money", label: store.t("navMoney"), icon: Icons.money }
  ];

  const moreSubItems = [
    { id: "more-gov", label: store.t("navMoreGovSupport"), icon: Icons.landmark },
    { id: "more-fin", label: store.t("navMoreFinSupport"), icon: Icons.money },
    { id: "more-knowledge", label: store.t("navMoreKnowledge"), icon: Icons.bookOpen },
    { id: "more-profile", label: store.t("navMoreProfile"), icon: Icons.user },
    { id: "more-settings", label: store.t("navMoreSettings"), icon: Icons.settings },
    { id: "more-help", label: store.t("navMoreHelp"), icon: Icons.info }
  ];

  // Desktop Sidebar HTML
  const sidebarHtml = `
    <aside class="app-sidebar" aria-label="Main Navigation">
      <div class="sidebar-brand" onclick="window.AgriNova.navigate('dashboard')">
        <div class="brand-logo-gem">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <div class="brand-text-block">
          <span class="brand-title">AgriNova</span>
          <span class="brand-sub">Market Linkage</span>
        </div>
      </div>

      <!-- Quick Active Crop & Location Pill in Sidebar -->
      <div class="sidebar-farmer-pill" onclick="window.AgriNova.navigate('more-profile')" title="View Farmer Profile">
        <div class="farmer-avatar">${state.farmer.avatar || "RK"}</div>
        <div class="farmer-meta">
          <span class="farmer-name">${state.farmer.name}</span>
          <span class="farmer-details-line">${state.commodities[state.selectedCropId]?.name || "Paddy"} • ${state.farmer.farmSizeAcres} ac • ${state.farmer.district}</span>
        </div>
      </div>

      <nav class="sidebar-nav-list" role="navigation">
        ${navItems
          .map((item) => {
            const activeClass = current === item.id ? "active" : "";
            return `
              <button 
                type="button" 
                class="nav-link-btn ${activeClass}" 
                onclick="window.AgriNova.navigate('${item.id}')"
                aria-current="${current === item.id ? 'page' : 'false'}"
              >
                <span class="nav-icon-box">${item.icon("nav-icon")}</span>
                <span class="nav-label">${item.label}</span>
                ${item.badge ? `<span class="nav-badge ${item.badge === 'Live' ? 'badge-pulse' : ''}">${item.badge}</span>` : ""}
              </button>
            `;
          })
          .join("")}

        <!-- Expandable "More" Item (Requirements 5 & 6) -->
        <div class="more-nav-container ${isMoreExpanded ? 'is-expanded' : ''} ${isMoreActive ? 'has-active-subitem' : ''}">
          <button 
            type="button" 
            class="nav-link-btn more-toggle-btn ${isMoreActive ? 'active' : ''}" 
            onclick="window.AgriNova.toggleMoreMenu()"
            aria-expanded="${isMoreExpanded ? 'true' : 'false'}"
            aria-controls="sidebarMoreSubmenu"
          >
            <span class="nav-icon-box">${Icons.more("nav-icon")}</span>
            <span class="nav-label">${store.t("navMore")}</span>
            <span class="more-chevron-icon ${isMoreExpanded ? 'rotate-open' : ''}">
              ${Icons.chevronDown("icon-xs")}
            </span>
          </button>

          <!-- Expanded directly underneath (Requirement 6) -->
          <div class="more-subnav-panel ${isMoreExpanded ? 'show' : ''}" id="sidebarMoreSubmenu">
            ${moreSubItems
              .map((sub) => {
                const subActive = current === sub.id ? "active" : "";
                return `
                  <button 
                    type="button" 
                    class="subnav-link-btn ${subActive}" 
                    onclick="window.AgriNova.navigate('${sub.id}')"
                  >
                    <span class="subnav-bullet"></span>
                    <span class="subnav-icon">${sub.icon("sub-icon")}</span>
                    <span class="subnav-label">${sub.label}</span>
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>
      </nav>

      <!-- Sidebar Footer with Language Switcher & Version -->
      <div class="sidebar-footer">
        <div class="lang-selector-compact">
          <span class="lang-globe-icon">${Icons.settings("icon-xs")}</span>
          <select onchange="window.AgriNova.setLanguage(this.value)" aria-label="Select Application Language" class="lang-select">
            <option value="en" ${state.currentLanguage === 'en' ? 'selected' : ''}>EN — English</option>
            <option value="ta" ${state.currentLanguage === 'ta' ? 'selected' : ''}>TA — தமிழ்</option>
            <option value="hi" ${state.currentLanguage === 'hi' ? 'selected' : ''}>HI — हिन्दी</option>
            <option value="te" ${state.currentLanguage === 'te' ? 'selected' : ''}>TE — తెలుగు</option>
            <option value="kn" ${state.currentLanguage === 'kn' ? 'selected' : ''}>KN — ಕನ್ನಡ</option>
            <option value="ml" ${state.currentLanguage === 'ml' ? 'selected' : ''}>ML — മലയാളം</option>
            <option value="mr" ${state.currentLanguage === 'mr' ? 'selected' : ''}>MR — मराठी</option>
          </select>
        </div>
        <div class="version-tag">AgriNova v2.0 • Production Quality</div>
      </div>
    </aside>
  `;

  // Mobile Bottom Navigation HTML (Requirement 92: Dashboard, Market, Sell, Farm, More)
  const mobileBottomBarHtml = `
    <nav class="mobile-bottom-bar" aria-label="Mobile Navigation">
      <button class="mobile-nav-btn ${current === 'dashboard' ? 'active' : ''}" onclick="window.AgriNova.navigate('dashboard')">
        ${Icons.dashboard("mob-nav-icon")}
        <span>${store.t("navDashboard")}</span>
      </button>

      <button class="mobile-nav-btn ${current === 'market' ? 'active' : ''}" onclick="window.AgriNova.navigate('market')">
        ${Icons.market("mob-nav-icon")}
        <span>${store.t("navMarket")}</span>
      </button>

      <button class="mobile-nav-btn sell-cta ${current === 'sell' ? 'active' : ''}" onclick="window.AgriNova.navigate('sell')">
        <div class="sell-cta-circle">${Icons.sell("mob-nav-icon-cta")}</div>
        <span>${store.t("navSell")}</span>
      </button>

      <button class="mobile-nav-btn ${current === 'farm' ? 'active' : ''}" onclick="window.AgriNova.navigate('farm')">
        ${Icons.farm("mob-nav-icon")}
        <span>${store.t("navFarm")}</span>
      </button>

      <button class="mobile-nav-btn ${isMoreActive || isMoreExpanded ? 'active' : ''}" onclick="window.AgriNova.toggleMobileMoreSheet()">
        ${Icons.more("mob-nav-icon")}
        <span>${store.t("navMore")}</span>
      </button>
    </nav>

    <!-- Mobile More Bottom Sheet Modal -->
    <div class="mobile-more-sheet-backdrop ${state.mobileMenuOpen ? 'open' : ''}" onclick="window.AgriNova.toggleMobileMoreSheet()">
      <div class="mobile-more-sheet" onclick="event.stopPropagation()">
        <div class="sheet-drag-handle"></div>
        <div class="sheet-header">
          <h4>${store.t("navMore")} Options</h4>
          <button class="sheet-close-btn" onclick="window.AgriNova.toggleMobileMoreSheet()">${Icons.x("icon-sm")}</button>
        </div>
        <div class="sheet-grid">
          <button class="sheet-item ${current === 'farmcare' ? 'active' : ''}" onclick="window.AgriNova.navigate('farmcare')">
            <div class="sheet-icon-wrap">${Icons.farmCare("icon-md")}</div>
            <span>${store.t("navFarmCare")}</span>
          </button>
          <button class="sheet-item ${current === 'money' ? 'active' : ''}" onclick="window.AgriNova.navigate('money')">
            <div class="sheet-icon-wrap">${Icons.money("icon-md")}</div>
            <span>${store.t("navMoney")}</span>
          </button>
          <button class="sheet-item ${current === 'more-gov' ? 'active' : ''}" onclick="window.AgriNova.navigate('more-gov')">
            <div class="sheet-icon-wrap">${Icons.landmark("icon-md")}</div>
            <span>${store.t("navMoreGovSupport")}</span>
          </button>
          <button class="sheet-item ${current === 'more-fin' ? 'active' : ''}" onclick="window.AgriNova.navigate('more-fin')">
            <div class="sheet-icon-wrap">${Icons.money("icon-md")}</div>
            <span>${store.t("navMoreFinSupport")}</span>
          </button>
          <button class="sheet-item ${current === 'more-knowledge' ? 'active' : ''}" onclick="window.AgriNova.navigate('more-knowledge')">
            <div class="sheet-icon-wrap">${Icons.bookOpen("icon-md")}</div>
            <span>${store.t("navMoreKnowledge")}</span>
          </button>
          <button class="sheet-item ${current === 'more-profile' ? 'active' : ''}" onclick="window.AgriNova.navigate('more-profile')">
            <div class="sheet-icon-wrap">${Icons.user("icon-md")}</div>
            <span>${store.t("navMoreProfile")}</span>
          </button>
          <button class="sheet-item ${current === 'more-settings' ? 'active' : ''}" onclick="window.AgriNova.navigate('more-settings')">
            <div class="sheet-icon-wrap">${Icons.settings("icon-md")}</div>
            <span>${store.t("navMoreSettings")}</span>
          </button>
          <button class="sheet-item ${current === 'more-help' ? 'active' : ''}" onclick="window.AgriNova.navigate('more-help')">
            <div class="sheet-icon-wrap">${Icons.info("icon-md")}</div>
            <span>${store.t("navMoreHelp")}</span>
          </button>
        </div>
      </div>
    </div>
  `;

  return { sidebarHtml, mobileBottomBarHtml };
}
