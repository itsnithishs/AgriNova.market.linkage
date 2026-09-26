/**
 * AgriNova Platform - Centralized Reactive State Store
 * Implements observer pattern to guarantee 100% data consistency across all views (Req 82).
 */

import { INITIAL_DATA } from "../data/mockData.js";
import { TRANSLATIONS } from "../data/i18n.js";

class Store {
  constructor() {
    this.state = {
      // Routing & UI navigation
      currentView: "dashboard",
      moreMenuExpanded: false,
      mobileMenuOpen: false,
      activeModal: null, // modal id or null
      activeDrawer: null, // drawer id or null
      toast: null, // { message, type: 'success' | 'info' | 'warning', id }

      // Language
      currentLanguage: "en",

      // Farmer & Farm Context
      farmer: { ...INITIAL_DATA.farmer },
      bankDetails: { ...INITIAL_DATA.bankDetails },
      documents: [...INITIAL_DATA.documents],
      crops: [...INITIAL_DATA.crops],

      // Market Selections
      selectedCropId: "paddy",
      selectedMandiId: "mandi_tvm",
      selectedTimeframe: "30D", // 7D | 30D | 3M | 6M | 1Y
      quantityQuintals: 50,
      transportRatePerKmPerQ: 1.80, // customizable average
      customDistanceKm: 18,
      handlingFeePerQ: 30, // Loading, bag stitching, weighbridge, mandi cess

      // Market Data
      commodities: { ...INITIAL_DATA.commodities },
      mandiFilterMode: "BEST_NET_VALUE", // 'HIGHEST_PRICE' | 'NEAREST' | 'RISING' | 'BEST_NET_VALUE' | 'AVAILABLE_BUYERS'

      // Potential Buyers & Linkage
      potentialBuyers: [...INITIAL_DATA.potentialBuyers],
      listings: [...INITIAL_DATA.listings],
      offers: [...INITIAL_DATA.offers],

      // Tasks & FarmCare
      tasks: [...INITIAL_DATA.tasks],
      weather: { ...INITIAL_DATA.weather },
      farmHealth: { ...INITIAL_DATA.farmHealth },

      // Money
      finance: { ...INITIAL_DATA.finance },

      // Watchlist & Alerts
      watchlist: [...INITIAL_DATA.watchlist],
      alerts: [...INITIAL_DATA.alerts],

      // Support & Knowledge
      governmentSupport: [...INITIAL_DATA.governmentSupport],
      financialSupport: [...INITIAL_DATA.financialSupport],
      knowledgeArticles: [...INITIAL_DATA.knowledgeArticles],
      loginHistory: [...INITIAL_DATA.loginHistory],
      recentActivity: [...INITIAL_DATA.recentActivity],

      // Assistant context
      assistantHistory: [
        {
          sender: "system",
          text: "Vanakkam Ravi! I am your AgriNova Market Assistant. I can help compare mandis, calculate your take-home net value, explain price signals, and check buyer requirements. What would you like to explore today?",
          time: "10:35 AM"
        }
      ]
    };

    this.listeners = new Set();
  }

  // Subscribe to state updates
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all components
  emitChange() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.state);
      } catch (err) {
        console.error("Store listener error:", err);
      }
    });
  }

  // Get current translation text
  t(key) {
    const lang = this.state.currentLanguage || "en";
    const dict = TRANSLATIONS[lang] || TRANSLATIONS["en"];
    return dict[key] || TRANSLATIONS["en"][key] || key;
  }

  // Set Language
  setLanguage(langCode) {
    if (TRANSLATIONS[langCode]) {
      this.state.currentLanguage = langCode;
      this.emitChange();
      this.showToast(`Language updated to ${langCode.toUpperCase()}`, "info");
    }
  }

  // Navigation
  navigate(viewId) {
    this.state.currentView = viewId;
    // Auto collapse mobile drawer if open
    this.state.mobileMenuOpen = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.emitChange();
  }

  // Toggle More Menu directly in place (Req 6)
  toggleMoreMenu() {
    this.state.moreMenuExpanded = !this.state.moreMenuExpanded;
    this.emitChange();
  }

  setMoreMenuExpanded(expanded) {
    this.state.moreMenuExpanded = expanded;
    this.emitChange();
  }

  // Change Crop
  setCrop(cropId) {
    if (this.state.commodities[cropId]) {
      this.state.selectedCropId = cropId;
      const commodity = this.state.commodities[cropId];
      if (commodity.nearbyMandis && commodity.nearbyMandis.length > 0) {
        this.state.selectedMandiId = commodity.nearbyMandis[0].id;
        this.state.customDistanceKm = commodity.nearbyMandis[0].distanceKm;
      }
      this.emitChange();
    }
  }

  // Change Selected Mandi
  setMandi(mandiId) {
    const commodity = this.getCurrentCommodity();
    const mandi = commodity.nearbyMandis?.find((m) => m.id === mandiId);
    if (mandi) {
      this.state.selectedMandiId = mandiId;
      this.state.customDistanceKm = mandi.distanceKm;
      this.emitChange();
    }
  }

  // Change Graph Timeframe
  setTimeframe(tf) {
    this.state.selectedTimeframe = tf;
    this.emitChange();
  }

  // Change Quantity
  setQuantity(qty) {
    const parsed = Math.max(1, Math.min(10000, Number(qty) || 1));
    this.state.quantityQuintals = parsed;
    this.emitChange();
  }

  // Set Mandi Filter Sorting
  setMandiFilterMode(mode) {
    this.state.mandiFilterMode = mode;
    this.emitChange();
  }

  // Get current active commodity object
  getCurrentCommodity() {
    return this.state.commodities[this.state.selectedCropId] || this.state.commodities["paddy"];
  }

  // Get current selected mandi object
  getCurrentMandi() {
    const comm = this.getCurrentCommodity();
    return comm.nearbyMandis?.find((m) => m.id === this.state.selectedMandiId) || comm.nearbyMandis?.[0];
  }

  // Net Realisable Value Calculation (Req 30 & 72)
  // Formula: Net Value = Gross Produce Value - (Transport + Additional Handling/Cess)
  calculateNetValue(mandi, customQty = null) {
    const qty = customQty !== null ? customQty : this.state.quantityQuintals;
    const pricePerQ = mandi.pricePerQ;
    const grossValue = pricePerQ * qty;

    // Transport calculation: rate/km/q * distance * quantity OR per quintal estimate
    const transportPerQ = mandi.estTransportPerQ || Math.round(mandi.distanceKm * 1.6);
    const totalTransport = transportPerQ * qty;

    // Additional handling: Mandi cess (approx 1%), loading/unloading ₹30/q
    const handlingPerQ = this.state.handlingFeePerQ;
    const totalHandling = handlingPerQ * qty;

    const totalDeductions = totalTransport + totalHandling;
    const netValue = Math.max(0, grossValue - totalDeductions);
    const netRatePerQ = Math.round(netValue / qty);

    return {
      quantityQuintals: qty,
      pricePerQ,
      grossValue,
      transportPerQ,
      totalTransport,
      handlingPerQ,
      totalHandling,
      totalDeductions,
      netValue,
      netRatePerQ,
      distanceKm: mandi.distanceKm
    };
  }

  // Add a new crop to Farm and sync with system (Req 44)
  addCrop(newCrop) {
    const id = newCrop.id || newCrop.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const cropEntry = {
      id,
      name: newCrop.name,
      variety: newCrop.variety || "Standard Variety",
      areaAcres: Number(newCrop.areaAcres) || 1,
      cultivationDate: newCrop.cultivationDate || new Date().toISOString().split("T")[0],
      expectedHarvest: newCrop.expectedHarvest || "Dec 2026",
      expectedQuantityQuintals: Number(newCrop.expectedQuantityQuintals) || 20,
      grade: newCrop.grade || "FAQ",
      status: "Actively Growing",
      healthScore: 85,
      irrigationStatus: "Adequate"
    };

    this.state.crops.push(cropEntry);
    this.state.farmer.primaryCropId = id;
    this.state.selectedCropId = this.state.commodities[id] ? id : "paddy";

    // Add activity record
    this.addActivity({
      type: "crop",
      title: "New Crop Registered",
      desc: `${cropEntry.name} (${cropEntry.areaAcres} acres) added to your farm profile.`,
      time: "Just now"
    });

    this.showToast(`Crop '${cropEntry.name}' added and synced across AgriNova.`, "success");
    this.emitChange();
  }

  // Create Produce Listing (Req 36)
  createListing(listingData) {
    const newId = `listing_${Date.now()}`;
    const listing = {
      id: newId,
      cropId: listingData.cropId || this.state.selectedCropId,
      cropName: listingData.cropName || this.getCurrentCommodity().name,
      variety: listingData.variety || "Standard FAQ",
      quantityQuintals: Number(listingData.quantityQuintals) || this.state.quantityQuintals,
      grade: listingData.grade || "FAQ",
      availableDate: listingData.availableDate || "Immediate / 10 Days",
      expectedPricePerQ: Number(listingData.expectedPricePerQ) || this.getCurrentCommodity().currentPrice,
      location: listingData.location || `${this.state.farmer.village}, ${this.state.farmer.district}`,
      status: "PUBLISHED",
      createdDate: "Today",
      viewsCount: 1,
      interestsCount: 0,
      offersCount: 0,
      activeOfferId: null
    };

    this.state.listings.unshift(listing);
    this.addActivity({
      type: "listing",
      title: "Produce Listing Published",
      desc: `${listing.quantityQuintals}q ${listing.cropName} listed at ₹${listing.expectedPricePerQ}/q.`,
      time: "Just now"
    });

    this.showToast("Your produce listing has been published to verified buyers!", "success");
    this.emitChange();
    return listing;
  }

  // Accept a Buyer Offer (Req 40 & 95)
  acceptOffer(offerId) {
    const offer = this.state.offers.find((o) => o.id === offerId);
    if (offer) {
      offer.status = "SALE_CONFIRMED";

      // Update listing timeline
      const listing = this.state.listings.find((l) => l.id === offer.listingId);
      if (listing) {
        listing.status = "SALE_CONFIRMED";
      }

      // Add to sales finance records
      const newSale = {
        id: `sale_${Date.now()}`,
        date: "Today",
        cropName: listing ? listing.cropName : "Paddy",
        buyerName: offer.buyerName,
        quantityQuintals: offer.quantityQuintals,
        ratePerQ: offer.offerPricePerQ,
        grossAmount: offer.grossAmount,
        netReceived: 0,
        status: "PENDING",
        expectedDate: "Within 48 hours",
        paymentMode: "Direct Bank Transfer (NEFT)",
        invoiceNo: `INV-${Date.now().toString().slice(-6)}`
      };
      this.state.finance.sales.unshift(newSale);
      this.state.finance.summary.totalPending += offer.grossAmount;

      this.addActivity({
        type: "offer",
        title: "Sale Confirmed With Buyer",
        desc: `Offer from ${offer.buyerName} for ₹${offer.grossAmount.toLocaleString("en-IN")} confirmed.`,
        time: "Just now"
      });

      this.showToast("Sale confirmed! Transaction transferred to Money tracker.", "success");
      this.emitChange();
    }
  }

  // Field Task Management (Req 48)
  toggleTask(taskId) {
    const task = this.state.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
      if (task.status === "COMPLETED") {
        this.addActivity({
          type: "task",
          title: "Field Task Completed",
          desc: `Completed: ${task.title}`,
          time: "Just now"
        });
        this.showToast(`Task '${task.title}' marked completed.`, "success");
      }
      this.emitChange();
    }
  }

  addTask(taskData) {
    const newTask = {
      id: `task_${Date.now()}`,
      cropId: taskData.cropId || this.state.selectedCropId,
      cropName: taskData.cropName || this.getCurrentCommodity().name,
      category: taskData.category || "Field Activity",
      title: taskData.title,
      dueDate: taskData.dueDate || "Upcoming",
      displayDate: taskData.displayDate || "Soon",
      status: "PENDING",
      urgency: taskData.urgency || "MEDIUM",
      instructions: taskData.instructions || ""
    };
    this.state.tasks.push(newTask);
    this.showToast(`Task '${newTask.title}' scheduled.`, "success");
    this.emitChange();
  }

  // Create Price Alert (Req 33 & 76)
  createAlert(alertData) {
    const newAlert = {
      id: `alert_${Date.now()}`,
      cropName: alertData.cropName || this.getCurrentCommodity().name,
      condition: alertData.condition || "Crosses Above",
      targetPrice: Number(alertData.targetPrice) || this.getCurrentCommodity().currentPrice,
      active: true,
      createdDate: "Today",
      notifyVia: alertData.notifyVia || "SMS & In-App"
    };
    this.state.alerts.push(newAlert);
    this.showToast(`Price alert set: ${newAlert.cropName} ${newAlert.condition} ₹${newAlert.targetPrice}/q`, "success");
    this.emitChange();
  }

  toggleAlert(alertId) {
    const alert = this.state.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.active = !alert.active;
      this.emitChange();
    }
  }

  // Watchlist (Req 34)
  toggleWatchlist(item) {
    const index = this.state.watchlist.findIndex((w) => w.id === item.id && w.type === item.type);
    if (index >= 0) {
      this.state.watchlist.splice(index, 1);
      this.showToast(`Removed '${item.label}' from watchlist.`, "info");
    } else {
      this.state.watchlist.push(item);
      this.showToast(`Added '${item.label}' to watchlist.`, "success");
    }
    this.emitChange();
  }

  isWatched(id, type) {
    return this.state.watchlist.some((w) => w.id === id && w.type === type);
  }

  // Assistant Query Processing (Req 56, 57, 58)
  askAssistant(questionText) {
    const currentComm = this.getCurrentCommodity();
    const currentMandi = this.getCurrentMandi();
    const netCalc = this.calculateNetValue(currentMandi);

    // Record user question
    this.state.assistantHistory.push({
      sender: "user",
      text: questionText,
      time: "Just now"
    });

    const q = questionText.toLowerCase();
    let reply = "";

    if (q.includes("today") || q.includes("price") || q.includes("rate") || q.includes("விலை") || q.includes("भाव")) {
      reply = `Today's modal rate for ${currentComm.name} at ${currentMandi.name} is ₹${currentMandi.pricePerQ.toLocaleString("en-IN")}/quintal (Range: ₹${currentMandi.minPrice} – ₹${currentMandi.maxPrice}). Compared to yesterday, prices have moved ${currentComm.change >= 0 ? "+" : ""}${currentComm.change} ₹/q. [Benchmark status: Demo Benchmark Data]`;
    } else if (q.includes("highest") || q.includes("best mandi") || q.includes("nearby") || q.includes("compare")) {
      const sortedByGross = [...currentComm.nearbyMandis].sort((a, b) => b.pricePerQ - a.pricePerQ);
      const sortedByNet = [...currentComm.nearbyMandis].sort((a, b) => {
        return this.calculateNetValue(b).netRatePerQ - this.calculateNetValue(a).netRatePerQ;
      });
      reply = `Highest gross price is at ${sortedByGross[0].name} (₹${sortedByGross[0].pricePerQ}/q, ${sortedByGross[0].distanceKm} km away). However, factoring transportation costs, the best estimated net realisation is at ${sortedByNet[0].name} (Approx ₹${this.calculateNetValue(sortedByNet[0]).netRatePerQ}/q after transit costs).`;
    } else if (q.includes("net value") || q.includes("transport") || q.includes("realisable")) {
      reply = `For your ${netCalc.quantityQuintals} quintals at ${currentMandi.name}: Gross value is ₹${netCalc.grossValue.toLocaleString("en-IN")}. Estimated transport is ₹${netCalc.totalTransport.toLocaleString("en-IN")} (₹${netCalc.transportPerQ}/q over ${netCalc.distanceKm} km) plus loading/handling of ₹${netCalc.totalHandling.toLocaleString("en-IN")}. Your estimated take-home net value is ₹${netCalc.netValue.toLocaleString("en-IN")} (~₹${netCalc.netRatePerQ}/q).`;
    } else if (q.includes("buyer") || q.includes("sell") || q.includes("match")) {
      const matchCount = this.state.potentialBuyers.filter((b) => b.cropId === this.state.selectedCropId).length;
      reply = `There are currently ${matchCount} verified buyers matching ${currentComm.name}. The highest matching buyer is Ponni Modern Rice Mills (94% match, offering ₹3,050/q delivered) with prompt 24-hr bank settlement.`;
    } else if (q.includes("weather") || q.includes("rain") || q.includes("வானிலை")) {
      reply = `Weather Alert: ${this.state.weather.condition}, ${this.state.weather.tempC}°C. ${this.state.weather.implications.harvesting} ${this.state.weather.implications.transport}`;
    } else if (q.includes("forecast") || q.includes("future") || q.includes("outlook")) {
      const p30 = currentComm.forecast.periods.find((p) => p.timeframe === "30 Days");
      reply = `30-Day Estimated Price Outlook for ${currentComm.name}: Expected range is ${p30 ? p30.range : "₹2,940 – ₹3,080/q"} (${currentComm.forecast.modelConfidence}). Signal note: ${currentComm.forecast.disclaimer}`;
    } else {
      reply = `Based on current market context for ${currentComm.name} (${currentMandi.name} at ₹${currentMandi.pricePerQ}/q): Estimated net value is ₹${netCalc.netValue.toLocaleString("en-IN")} for ${netCalc.quantityQuintals} quintals. 30-day trend is ${currentComm.trend}. Please review nearby mandis or verified buyer offers before confirming your delivery.`;
    }

    setTimeout(() => {
      this.state.assistantHistory.push({
        sender: "system",
        text: reply,
        time: "Just now"
      });
      this.emitChange();
    }, 400);

    this.emitChange();
  }

  // Add recent activity
  addActivity(item) {
    this.state.recentActivity.unshift({
      id: `act_${Date.now()}`,
      type: item.type || "general",
      title: item.title,
      desc: item.desc,
      time: item.time || "Just now"
    });
    if (this.state.recentActivity.length > 8) {
      this.state.recentActivity.pop();
    }
  }

  // Toast notifications
  showToast(message, type = "info") {
    this.state.toast = {
      id: Date.now(),
      message,
      type
    };
    this.emitChange();

    setTimeout(() => {
      if (this.state.toast && this.state.toast.id === this.state.toast.id) {
        this.state.toast = null;
        this.emitChange();
      }
    }, 3800);
  }

  clearToast() {
    this.state.toast = null;
    this.emitChange();
  }
}

export const store = new Store();
