/**
 * AgriNova Platform - Centralized Mock Data & Initial State
 * Realistically modeled for Indian farmers, mandis, commodities, and buyer linkages.
 */

export const INITIAL_DATA = {
  // Current logged in farmer
  farmer: {
    id: "farmer_001",
    name: "Ravi Kumar",
    phone: "+91 98421 84920",
    email: "ravi.farmer@agrinova.in",
    village: "Kilnathur",
    taluk: "Tiruvannamalai",
    district: "Tiruvannamalai",
    state: "Tamil Nadu",
    pincode: "606601",
    farmSizeAcres: 4.5,
    landOwnership: "Owner (Patta No: 4829/TN)",
    irrigationType: "Borewell + Canal",
    primaryCropId: "paddy",
    farmingExperienceYears: 14,
    fpoMembership: "Tiruvannamalai Farmers Producer Co-op",
    kycStatus: "VERIFIED",
    avatar: "RK"
  },

  // Bank Details (Masked for privacy)
  bankDetails: {
    bankName: "State Bank of India",
    branch: "Tiruvannamalai Main Branch",
    accountNumberMasked: "•••• •••• •••• 4821",
    ifsc: "SBIN0000938",
    holderName: "RAVI KUMAR",
    verificationStatus: "VERIFIED_ACTIVE",
    upiId: "ravikumar@sbi"
  },

  // Documents
  documents: [
    {
      id: "doc_1",
      title: "Aadhaar Identity Card",
      type: "ID_PROOF",
      numberMasked: "•••• •••• 9214",
      status: "VERIFIED",
      uploadedDate: "14 Jan 2026",
      verifiedBy: "UIDAI / AgriNova Desk"
    },
    {
      id: "doc_2",
      title: "Land Patta & Chitta Record",
      type: "LAND_RECORD",
      numberMasked: "Survey 142/3B - Patta 4829",
      status: "VERIFIED",
      uploadedDate: "18 Jan 2026",
      verifiedBy: "TN Land Revenue Integration"
    },
    {
      id: "doc_3",
      title: "Soil Health Card",
      type: "AGRI_RECORD",
      numberMasked: "SHC-TN-TVM-8492",
      status: "ACTIVE",
      uploadedDate: "02 Jun 2026",
      verifiedBy: "Dept. of Agriculture, TN"
    }
  ],

  // Active Crops on Farm
  crops: [
    {
      id: "paddy",
      name: "Paddy (Rice)",
      variety: "BPT 5204 (Samba Mahsuri)",
      areaAcres: 4.5,
      cultivationDate: "12 Aug 2026",
      expectedHarvest: "15 Nov 2026",
      expectedQuantityQuintals: 50,
      grade: "FAQ (Fair Average Quality)",
      status: "Vegetative / Grain Filling",
      healthScore: 84,
      irrigationStatus: "Optimal (Canal cycle 3 days ago)",
      growthDays: 45,
      totalCycleDays: 135
    },
    {
      id: "groundnut",
      name: "Groundnut",
      variety: "TMV 7 (Bunch)",
      areaAcres: 1.5,
      cultivationDate: "01 Jul 2026",
      expectedHarvest: "20 Oct 2026",
      expectedQuantityQuintals: 18,
      grade: "Grade A",
      status: "Pod Formation",
      healthScore: 88,
      irrigationStatus: "Adequate (Light irrigation)",
      growthDays: 87,
      totalCycleDays: 110
    }
  ],

  // Master Crops Catalog with market rates and data
  commodities: {
    paddy: {
      name: "Paddy",
      hindiName: "धान",
      tamilName: "நெல்",
      unit: "quintal",
      defaultVariety: "BPT 5204",
      varieties: ["BPT 5204", "IR 64", "Sona Masoori", "Ponni", "Swarna"],
      grades: ["FAQ", "Grade A", "Organic Certified"],
      mspPrice: 2300, // Government Minimum Support Price (₹/q)
      currentPrice: 2950,
      minPrice: 2780,
      modalPrice: 2950,
      maxPrice: 3080,
      yesterdayPrice: 2870,
      change: 80,
      changePercent: 2.78,
      benchmarkMandi: "Tiruvannamalai Mandi",
      lastUpdated: "Today, 10:35 AM",
      dataStatus: "DEMO BENCHMARK DATA", // Requirement 12 & 88
      historical30dAvg: 2870,
      trend: "Moderately rising",
      arrivalVolumeTonnes: 420,
      normalArrivalTonnes: 580,
      // 5 Nearby Mandis
      nearbyMandis: [
        {
          id: "mandi_tvm",
          name: "Tiruvannamalai Mandi",
          district: "Tiruvannamalai",
          distanceKm: 18,
          pricePerQ: 2950,
          minPrice: 2780,
          maxPrice: 3080,
          trend: "rising",
          change: "+₹80",
          transportRatePerKmPerQ: 1.95,
          estTransportPerQ: 35,
          buyersCount: 14,
          arrivals: "420 tonnes",
          lastUpdate: "10:35 AM"
        },
        {
          id: "mandi_kanchi",
          name: "Kanchipuram Mandi",
          district: "Kanchipuram",
          distanceKm: 72,
          pricePerQ: 3040,
          minPrice: 2880,
          maxPrice: 3160,
          trend: "rising",
          change: "+₹110",
          transportRatePerKmPerQ: 1.52,
          estTransportPerQ: 110,
          buyersCount: 22,
          arrivals: "610 tonnes",
          lastUpdate: "10:15 AM"
        },
        {
          id: "mandi_vellore",
          name: "Vellore Mandi",
          district: "Vellore",
          distanceKm: 42,
          pricePerQ: 2910,
          minPrice: 2750,
          maxPrice: 2990,
          trend: "falling",
          change: "-₹20",
          transportRatePerKmPerQ: 1.66,
          estTransportPerQ: 70,
          buyersCount: 11,
          arrivals: "350 tonnes",
          lastUpdate: "09:50 AM"
        },
        {
          id: "mandi_chengalpattu",
          name: "Chengalpattu Mandi",
          district: "Chengalpattu",
          distanceKm: 86,
          pricePerQ: 2980,
          minPrice: 2820,
          maxPrice: 3060,
          trend: "stable",
          change: "+₹40",
          transportRatePerKmPerQ: 1.51,
          estTransportPerQ: 130,
          buyersCount: 18,
          arrivals: "490 tonnes",
          lastUpdate: "10:00 AM"
        },
        {
          id: "mandi_krishnagiri",
          name: "Krishnagiri Mandi",
          district: "Krishnagiri",
          distanceKm: 110,
          pricePerQ: 2890,
          minPrice: 2720,
          maxPrice: 2960,
          trend: "rising",
          change: "+₹15",
          transportRatePerKmPerQ: 1.50,
          estTransportPerQ: 165,
          buyersCount: 9,
          arrivals: "280 tonnes",
          lastUpdate: "09:30 AM"
        }
      ],
      // AI Outlook ranges
      forecast: {
        updatedAt: "26 Sep 2026, 06:00 AM",
        modelConfidence: "84% Confidence",
        disclaimer: "Estimated forecast range based on arrival patterns, rainfall data, and seasonal demand. Not a financial guarantee.",
        periods: [
          { timeframe: "7 Days", range: "₹2,900 – ₹3,000", min: 2900, max: 3000, mid: 2950, sentiment: "Stable" },
          { timeframe: "15 Days", range: "₹2,920 – ₹3,030", min: 2920, max: 3030, mid: 2975, sentiment: "Mild Uptrend" },
          { timeframe: "30 Days", range: "₹2,940 – ₹3,080", min: 2940, max: 3080, mid: 3010, sentiment: "Favorable" },
          { timeframe: "45 Days", range: "₹2,910 – ₹3,070", min: 2910, max: 3070, mid: 2990, sentiment: "Volatile" },
          { timeframe: "60 Days", range: "₹2,880 – ₹3,060", min: 2880, max: 3060, mid: 2970, sentiment: "Harvest Peak Arrival" }
        ]
      },
      // Market signals
      signals: [
        {
          id: "sig_1",
          type: "trend",
          status: "POSITIVE",
          title: "Price Trend",
          summary: "Moderately rising (+2.8% over past 30 days).",
          explanation: "Sustained procurement demand from regional rice mills has supported steady modal rates.",
          date: "Updated today"
        },
        {
          id: "sig_2",
          type: "supply",
          status: "ATTENTION",
          title: "Arrival Volume",
          summary: "Arrivals lower by 27% compared to 3-year seasonal average.",
          explanation: "Temporary transport delays in neighbouring districts have restricted fresh mandi supplies.",
          date: "Source: Agmarknet TVM"
        },
        {
          id: "sig_3",
          type: "weather",
          status: "ATTENTION",
          title: "Weather Signal",
          summary: "Moderate rainfall forecast across North TN in next 72–96 hours.",
          explanation: "Farmers advised to avoid open-yard drying; transport costs may surge 5-8% during rain days.",
          date: "IMD Agro Advisory"
        },
        {
          id: "sig_4",
          type: "demand",
          status: "POSITIVE",
          title: "Regional Demand",
          summary: "Heavy procurement active from Kanchipuram & Chennai mills.",
          explanation: "Premium for low-moisture FAQ BPT 5204 reaching +₹120/q above baseline modal.",
          date: "Trade Network Feed"
        },
        {
          id: "sig_5",
          type: "seasonal",
          status: "NEUTRAL",
          title: "Seasonal Pattern",
          summary: "Pre-harvest supply lull typical for late September.",
          explanation: "Historical data indicates prices peak 3 weeks prior to major Kharif harvest arrivals.",
          date: "AgriNova Historical Model"
        }
      ],
      // Selling Window advice (Neutral, farmer makes final decision)
      sellingWindow: {
        summary: "Current price is above the recent 30-day average, while the 45-day forecast range shows uncertainty.",
        contextPoints: [
          "Modal rate (₹2,950/q) is ₹80 higher than last week's average.",
          "Nearby Kanchipuram mandi offers higher gross rate (₹3,040/q), but requires ₹110/q transport cost.",
          "Incoming weather front may impact road haulage starting Thursday.",
          "Direct buyers currently active with verified purchase orders."
        ],
        adviceLevel: "BALANCED_FAVORABLE"
      }
    },

    wheat: {
      name: "Wheat",
      hindiName: "गेहूं",
      tamilName: "கோதுமை",
      unit: "quintal",
      defaultVariety: "Sharbati",
      varieties: ["Sharbati", "Kalyan Sona", "Lokwan", "HD 2967"],
      grades: ["FAQ", "Premium Milling", "Grade A"],
      mspPrice: 2275,
      currentPrice: 2540,
      minPrice: 2420,
      modalPrice: 2540,
      maxPrice: 2680,
      yesterdayPrice: 2510,
      change: 30,
      changePercent: 1.19,
      benchmarkMandi: "Salem Central Mandi",
      lastUpdated: "Today, 10:20 AM",
      dataStatus: "DEMO BENCHMARK DATA",
      historical30dAvg: 2490,
      trend: "Stable",
      arrivalVolumeTonnes: 310,
      normalArrivalTonnes: 320,
      nearbyMandis: [
        {
          id: "mandi_salem",
          name: "Salem Central Mandi",
          district: "Salem",
          distanceKm: 85,
          pricePerQ: 2540,
          minPrice: 2420,
          maxPrice: 2680,
          trend: "stable",
          change: "+₹30",
          transportRatePerKmPerQ: 1.60,
          estTransportPerQ: 135,
          buyersCount: 16,
          arrivals: "310 tonnes",
          lastUpdate: "10:20 AM"
        },
        {
          id: "mandi_dharmapuri",
          name: "Dharmapuri Mandi",
          district: "Dharmapuri",
          distanceKm: 98,
          pricePerQ: 2580,
          minPrice: 2440,
          maxPrice: 2710,
          trend: "rising",
          change: "+₹45",
          transportRatePerKmPerQ: 1.55,
          estTransportPerQ: 152,
          buyersCount: 12,
          arrivals: "280 tonnes",
          lastUpdate: "09:40 AM"
        }
      ],
      forecast: {
        updatedAt: "26 Sep 2026, 06:00 AM",
        modelConfidence: "81% Confidence",
        disclaimer: "Estimated forecast range. Not a financial guarantee.",
        periods: [
          { timeframe: "7 Days", range: "₹2,520 – ₹2,580", min: 2520, max: 2580, mid: 2550, sentiment: "Stable" },
          { timeframe: "15 Days", range: "₹2,540 – ₹2,620", min: 2540, max: 2620, mid: 2580, sentiment: "Mild Uptrend" },
          { timeframe: "30 Days", range: "₹2,550 – ₹2,660", min: 2550, max: 2660, mid: 2605, sentiment: "Favorable" }
        ]
      },
      signals: [
        {
          id: "sig_w1",
          type: "trend",
          status: "POSITIVE",
          title: "Price Trend",
          summary: "Steady demand from institutional flour mills.",
          explanation: "Government reserve release pace is maintaining a steady price floor.",
          date: "Updated today"
        }
      ],
      sellingWindow: {
        summary: "Current price is stable around 30-day mean. No immediate supply shocks anticipated.",
        contextPoints: ["Steady mill demand", "Buffer stocks comfortable"],
        adviceLevel: "NEUTRAL_HOLD"
      }
    },

    groundnut: {
      name: "Groundnut",
      hindiName: "मूंगफली",
      tamilName: "நிலக்கடலை",
      unit: "quintal",
      defaultVariety: "TMV 7",
      varieties: ["TMV 7", "JL 24", "Kadir 6", "VRI 8"],
      grades: ["Grade A (Bold)", "FAQ", "Oil Pods"],
      mspPrice: 6377,
      currentPrice: 7150,
      minPrice: 6850,
      modalPrice: 7150,
      maxPrice: 7420,
      yesterdayPrice: 7080,
      change: 70,
      changePercent: 0.99,
      benchmarkMandi: "Tindivanam Regulated Market",
      lastUpdated: "Today, 10:10 AM",
      dataStatus: "DEMO BENCHMARK DATA",
      historical30dAvg: 6980,
      trend: "Moderately rising",
      arrivalVolumeTonnes: 190,
      normalArrivalTonnes: 240,
      nearbyMandis: [
        {
          id: "mandi_tindivanam",
          name: "Tindivanam Mandi",
          district: "Villupuram",
          distanceKm: 54,
          pricePerQ: 7150,
          minPrice: 6850,
          maxPrice: 7420,
          trend: "rising",
          change: "+₹70",
          transportRatePerKmPerQ: 1.70,
          estTransportPerQ: 92,
          buyersCount: 19,
          arrivals: "190 tonnes",
          lastUpdate: "10:10 AM"
        },
        {
          id: "mandi_villupuram",
          name: "Villupuram Mandi",
          district: "Villupuram",
          distanceKm: 62,
          pricePerQ: 7220,
          minPrice: 6920,
          maxPrice: 7490,
          trend: "rising",
          change: "+₹110",
          transportRatePerKmPerQ: 1.65,
          estTransportPerQ: 102,
          buyersCount: 24,
          arrivals: "260 tonnes",
          lastUpdate: "10:25 AM"
        }
      ],
      forecast: {
        updatedAt: "26 Sep 2026, 06:00 AM",
        modelConfidence: "86% Confidence",
        disclaimer: "Estimated forecast range. Not a financial guarantee.",
        periods: [
          { timeframe: "7 Days", range: "₹7,100 – ₹7,280", min: 7100, max: 7280, mid: 7190, sentiment: "Firm" },
          { timeframe: "15 Days", range: "₹7,150 – ₹7,350", min: 7150, max: 7350, mid: 7250, sentiment: "Positive" },
          { timeframe: "30 Days", range: "₹7,200 – ₹7,480", min: 7200, max: 7480, mid: 7340, sentiment: "Bullish" }
        ]
      },
      signals: [
        {
          id: "sig_g1",
          type: "demand",
          status: "POSITIVE",
          title: "Oil Mill Crush Demand",
          summary: "Crushing mills bidding aggressively for high oil content lots.",
          explanation: "Vegetable oil import costs driving domestic crush parity higher.",
          date: "Tindivanam Market Board"
        }
      ],
      sellingWindow: {
        summary: "Groundnut pod prices are trading ₹773 above MSP with steady oil mill off-take.",
        contextPoints: ["High oil crushing demand", "Firm export market for HPS grade"],
        adviceLevel: "FAVORABLE_SELL"
      }
    },

    cotton: {
      name: "Cotton",
      hindiName: "कपास",
      tamilName: "பருத்தி",
      unit: "quintal",
      defaultVariety: "MCU 5",
      varieties: ["MCU 5", "DCH 32", "Bunny", "Suvin"],
      grades: ["Grade A Long Staple", "FAQ Medium", "Spotted"],
      mspPrice: 7121,
      currentPrice: 7480,
      minPrice: 7200,
      modalPrice: 7480,
      maxPrice: 7750,
      yesterdayPrice: 7430,
      change: 50,
      changePercent: 0.67,
      benchmarkMandi: "Kongu Cotton Exchange, Tiruppur",
      lastUpdated: "Today, 09:45 AM",
      dataStatus: "DEMO BENCHMARK DATA",
      historical30dAvg: 7340,
      trend: "Rising",
      arrivalVolumeTonnes: 140,
      normalArrivalTonnes: 210,
      nearbyMandis: [
        {
          id: "mandi_tiruppur",
          name: "Tiruppur Regulated Market",
          district: "Tiruppur",
          distanceKm: 180,
          pricePerQ: 7480,
          minPrice: 7200,
          maxPrice: 7750,
          trend: "rising",
          change: "+₹50",
          transportRatePerKmPerQ: 1.45,
          estTransportPerQ: 260,
          buyersCount: 31,
          arrivals: "140 tonnes",
          lastUpdate: "09:45 AM"
        }
      ],
      forecast: {
        updatedAt: "26 Sep 2026, 06:00 AM",
        modelConfidence: "78% Confidence",
        disclaimer: "Estimated forecast range. Not a financial guarantee.",
        periods: [
          { timeframe: "7 Days", range: "₹7,420 – ₹7,580", min: 7420, max: 7580, mid: 7500, sentiment: "Stable" },
          { timeframe: "30 Days", range: "₹7,480 – ₹7,720", min: 7480, max: 7720, mid: 7600, sentiment: "Favorable" }
        ]
      },
      signals: [
        {
          id: "sig_c1",
          type: "demand",
          status: "POSITIVE",
          title: "Spinning Mill Off-take",
          summary: "Spinning mills actively rebuilding yarn production inventories.",
          explanation: "Export orders for combed yarn have picked up this quarter.",
          date: "Textile Commissioner Data"
        }
      ],
      sellingWindow: {
        summary: "Prices remain healthy above MSP; consider lot moisture testing prior to ginning transport.",
        contextPoints: ["High spinning demand", "Strict moisture penalty (>8%)"],
        adviceLevel: "BALANCED_FAVORABLE"
      }
    },

    tomato: {
      name: "Tomato",
      hindiName: "टमाटर",
      tamilName: "தக்காளி",
      unit: "quintal",
      defaultVariety: "PKM 1 Hybrid",
      varieties: ["PKM 1 Hybrid", "Shivam", "Vaishnavi", "Arka Rakshak"],
      grades: ["Grade A (Firm Red)", "Grade B", "Processing"],
      mspPrice: 0, // No official MSP for perishables
      currentPrice: 2200,
      minPrice: 1850,
      modalPrice: 2200,
      maxPrice: 2550,
      yesterdayPrice: 2050,
      change: 150,
      changePercent: 7.32,
      benchmarkMandi: "Koyambedu Wholesale Market, Chennai",
      lastUpdated: "Today, 08:30 AM",
      dataStatus: "DEMO BENCHMARK DATA",
      historical30dAvg: 1980,
      trend: "Sharply rising",
      arrivalVolumeTonnes: 780,
      normalArrivalTonnes: 920,
      nearbyMandis: [
        {
          id: "mandi_koyambedu",
          name: "Koyambedu Wholesale, Chennai",
          district: "Chennai",
          distanceKm: 145,
          pricePerQ: 2200,
          minPrice: 1850,
          maxPrice: 2550,
          trend: "rising",
          change: "+₹150",
          transportRatePerKmPerQ: 1.80,
          estTransportPerQ: 260,
          buyersCount: 45,
          arrivals: "780 tonnes",
          lastUpdate: "08:30 AM"
        },
        {
          id: "mandi_vellore_veg",
          name: "Vellore Vegetable Market",
          district: "Vellore",
          distanceKm: 42,
          pricePerQ: 2050,
          minPrice: 1750,
          maxPrice: 2300,
          trend: "rising",
          change: "+₹90",
          transportRatePerKmPerQ: 1.85,
          estTransportPerQ: 78,
          buyersCount: 20,
          arrivals: "220 tonnes",
          lastUpdate: "09:00 AM"
        }
      ],
      forecast: {
        updatedAt: "26 Sep 2026, 06:00 AM",
        modelConfidence: "72% Confidence (Perishable Volatility)",
        disclaimer: "Estimated forecast range. Perishables subject to daily weather swings.",
        periods: [
          { timeframe: "7 Days", range: "₹2,100 – ₹2,450", min: 2100, max: 2450, mid: 2275, sentiment: "High Volatility" },
          { timeframe: "15 Days", range: "₹1,950 – ₹2,350", min: 1950, max: 2350, mid: 2150, sentiment: "Incoming Flush" }
        ]
      },
      signals: [
        {
          id: "sig_t1",
          type: "weather",
          status: "WARNING",
          title: "Rain Impact on Shelf Life",
          summary: "High humidity shortening transport transit resilience.",
          explanation: "Fruit harvested during rain must be sold within 24-36 hours or pre-cooled.",
          date: "Horticulture Alert"
        }
      ],
      sellingWindow: {
        summary: "Perishable commodity with short holding window. Sell harvest in batches to nearby mandis to avoid spoilage.",
        contextPoints: ["High volatility", "Quick perishability"],
        adviceLevel: "FAVORABLE_SELL"
      }
    },

    maize: {
      name: "Maize (Corn)",
      hindiName: "मक्का",
      tamilName: "மக்காச்சோளம்",
      unit: "quintal",
      defaultVariety: "Pioneer Hybrid",
      varieties: ["Pioneer Hybrid", "Kaveri 50", "CO 6", "NK 6240"],
      grades: ["Poultry Grade (Moisture <13%)", "FAQ Feed", "Industrial"],
      mspPrice: 2090,
      currentPrice: 2380,
      minPrice: 2260,
      modalPrice: 2380,
      maxPrice: 2470,
      yesterdayPrice: 2350,
      change: 30,
      changePercent: 1.28,
      benchmarkMandi: "Namakkal Poultry Hub Mandi",
      lastUpdated: "Today, 10:00 AM",
      dataStatus: "DEMO BENCHMARK DATA",
      historical30dAvg: 2310,
      trend: "Rising",
      arrivalVolumeTonnes: 390,
      normalArrivalTonnes: 440,
      nearbyMandis: [
        {
          id: "mandi_namakkal",
          name: "Namakkal Feed Exchange",
          district: "Namakkal",
          distanceKm: 140,
          pricePerQ: 2380,
          minPrice: 2260,
          maxPrice: 2470,
          trend: "rising",
          change: "+₹30",
          transportRatePerKmPerQ: 1.50,
          estTransportPerQ: 210,
          buyersCount: 28,
          arrivals: "390 tonnes",
          lastUpdate: "10:00 AM"
        }
      ],
      forecast: {
        updatedAt: "26 Sep 2026, 06:00 AM",
        modelConfidence: "83% Confidence",
        disclaimer: "Estimated forecast range. Not a financial guarantee.",
        periods: [
          { timeframe: "7 Days", range: "₹2,360 – ₹2,420", min: 2360, max: 2420, mid: 2390, sentiment: "Firm" },
          { timeframe: "30 Days", range: "₹2,390 – ₹2,480", min: 2390, max: 2480, mid: 2435, sentiment: "Bullish" }
        ]
      },
      signals: [
        {
          id: "sig_m1",
          type: "demand",
          status: "POSITIVE",
          title: "Poultry Feed Demand",
          summary: "Heavy feed formulation purchases from Namakkal poultry belt.",
          explanation: "Egg producers operating at full capacity, keeping grain demand firm.",
          date: "Namakkal Poultry Association"
        }
      ],
      sellingWindow: {
        summary: "Dry lots with <13% moisture fetching direct factory purchase at ₹2,450/q delivered.",
        contextPoints: ["Steady feed mill demand", "Moisture test crucial"],
        adviceLevel: "FAVORABLE_SELL"
      }
    }
  },

  // Potential Buyers with Match Scores and Transparency
  potentialBuyers: [
    {
      id: "buyer_01",
      companyName: "Ponni Modern Rice Mills Pvt Ltd",
      category: "Rice Processing & Milling",
      location: "Kanchipuram Industrial Estate",
      district: "Kanchipuram",
      distanceKm: 68,
      cropId: "paddy",
      gradeRequired: "FAQ (BPT 5204 / Samba Mahsuri)",
      minQtyTonnes: 5,
      maxQtyTonnes: 50,
      offerPricePerQ: 3050,
      baseMandiDiff: "+₹100/q",
      paymentTerms: "Direct Bank Transfer within 24 hours of weighbridge receipt",
      verificationStatus: "VERIFIED_BUYER",
      buyerRating: 4.8,
      dealsCompleted: 142,
      matchScore: 94,
      whyMatch: [
        "100% exact match for Paddy (BPT 5204).",
        "Your planned 50 quintal lot fits their 5–50 tonne procurement window.",
        "Delivered location (68 km) is within your 100 km preferred radius.",
        "Buyer offers fast 24-hr NEFT settlement with certified weighbridge slip."
      ]
    },
    {
      id: "buyer_02",
      companyName: "Cauvery Agri Foods & Grain Co.",
      category: "Wholesale Grain Aggregator",
      location: "Tiruvannamalai Bypass Road",
      district: "Tiruvannamalai",
      distanceKm: 14,
      cropId: "paddy",
      gradeRequired: "FAQ / Any Standard Paddy",
      minQtyTonnes: 2,
      maxQtyTonnes: 25,
      offerPricePerQ: 2980,
      baseMandiDiff: "+₹30/q",
      paymentTerms: "Instant UPI/NEFT on pickup from farm gate",
      verificationStatus: "VERIFIED_BUYER",
      buyerRating: 4.6,
      dealsCompleted: 89,
      matchScore: 91,
      whyMatch: [
        "Farm-gate pickup available — saves ₹35/q in transport hassles.",
        "Instant payment on loading after moisture verification.",
        "Very close proximity (14 km) eliminates long haul risk."
      ]
    },
    {
      id: "buyer_03",
      companyName: "Tamil Nadu Civil Supplies Corp (Direct Procurement Center)",
      category: "Government Agency (DPC)",
      location: "Kilnathur DPC Center",
      district: "Tiruvannamalai",
      distanceKm: 6,
      cropId: "paddy",
      gradeRequired: "Grade A / Common Paddy (Moisture <17%)",
      minQtyTonnes: 1,
      maxQtyTonnes: 100,
      offerPricePerQ: 2450, // MSP + Bonus
      baseMandiDiff: "MSP + State Incentive",
      paymentTerms: "Direct Benefit Transfer (DBT) to bank within 4-7 days",
      verificationStatus: "GOVT_DIRECT_DPC",
      buyerRating: 4.5,
      dealsCompleted: 620,
      matchScore: 82,
      whyMatch: [
        "Official Government Direct Purchase Center with guaranteed MSP.",
        "Direct bank credit via Aadhaar linked account.",
        "Ideal safeguard if open market rates face sudden dips."
      ]
    },
    {
      id: "buyer_04",
      companyName: "GreenValley Agro Organics Ltd",
      category: "Certified Organic & Premium Exporter",
      location: "Chengalpattu Logistics Park",
      district: "Chengalpattu",
      distanceKm: 88,
      cropId: "paddy",
      gradeRequired: "Organic / Zero Chemical Residue",
      minQtyTonnes: 10,
      maxQtyTonnes: 80,
      offerPricePerQ: 3250,
      baseMandiDiff: "+₹300/q",
      paymentTerms: "30% Advance + 70% upon lab certificate verification",
      verificationStatus: "VERIFIED_BUYER",
      buyerRating: 4.4,
      dealsCompleted: 53,
      matchScore: 71,
      whyMatch: [
        "Offers premium ₹3,250/q, but requires certified chemical-free test.",
        "Distance is 88 km, requiring dedicated transport booking.",
        "Payment depends on multi-day residue lab analysis."
      ]
    },
    {
      id: "buyer_05",
      companyName: "SV Oil Mills & Agro Industries",
      category: "Edible Oil Refiner",
      location: "Tindivanam Highway",
      district: "Villupuram",
      distanceKm: 58,
      cropId: "groundnut",
      gradeRequired: "TMV 7 Groundnut Pods (Oil >48%)",
      minQtyTonnes: 1,
      maxQtyTonnes: 20,
      offerPricePerQ: 7280,
      baseMandiDiff: "+₹130/q",
      paymentTerms: "Same-day RTGS upon sample oil testing",
      verificationStatus: "VERIFIED_BUYER",
      buyerRating: 4.9,
      dealsCompleted: 210,
      matchScore: 93,
      whyMatch: [
        "Perfect match for your active TMV 7 Groundnut crop.",
        "Top paying buyer in the Tindivanam oil processing belt.",
        "Immediate payment upon digital oil test readout."
      ]
    }
  ],

  // Produce Listings created by farmer
  listings: [
    {
      id: "listing_101",
      cropId: "paddy",
      cropName: "Paddy",
      variety: "BPT 5204 (Samba Mahsuri)",
      quantityQuintals: 50,
      grade: "FAQ (Moisture: 14.2%, Grain length: 5.6mm)",
      availableDate: "18 Nov 2026",
      expectedPricePerQ: 3000,
      location: "Kilnathur, Tiruvannamalai",
      status: "OFFER_RECEIVED", // Timeline: Draft -> Published -> Buyer Interest -> Offer Received -> Negotiation -> Sale Confirmed -> Completed
      createdDate: "20 Sep 2026",
      viewsCount: 64,
      interestsCount: 5,
      offersCount: 3,
      activeOfferId: "offer_201"
    }
  ],

  // Incoming Buyer Offers
  offers: [
    {
      id: "offer_201",
      listingId: "listing_101",
      buyerId: "buyer_01",
      buyerName: "Ponni Modern Rice Mills Pvt Ltd",
      offerPricePerQ: 3040,
      quantityQuintals: 50,
      grossAmount: 152000,
      estTransportPerQ: 110,
      totalTransportCost: 5500,
      estLoadingHandling: 1500,
      estNetRealisation: 145000,
      paymentTerms: "Direct Bank Transfer within 24 hours of weighbridge receipt",
      pickupOption: "Farmer Arranges Transport (Delivered to Kanchipuram)",
      validTill: "30 Sep 2026",
      status: "PENDING_FARMER_DECISION",
      notes: "Preferred lot: BPT 5204 with moisture under 15%."
    },
    {
      id: "offer_202",
      listingId: "listing_101",
      buyerId: "buyer_02",
      buyerName: "Cauvery Agri Foods & Grain Co.",
      offerPricePerQ: 2980,
      quantityQuintals: 50,
      grossAmount: 149000,
      estTransportPerQ: 0, // Farmgate pickup!
      totalTransportCost: 0,
      estLoadingHandling: 1000,
      estNetRealisation: 148000,
      paymentTerms: "Instant payment on farmgate loading via NEFT/UPI",
      pickupOption: "Buyer Picks Up From Farmgate",
      validTill: "02 Oct 2026",
      status: "RECEIVED",
      notes: "We bring our own truck and digital scales. No transport headache."
    }
  ],

  // Field Tasks for FarmCare & Dashboard
  tasks: [
    {
      id: "task_01",
      cropId: "paddy",
      cropName: "Paddy",
      category: "Fertilizer",
      title: "Top-dress Urea & Potash (17:17:17)",
      dueDate: "28 Sep 2026",
      displayDate: "28 Sep",
      status: "PENDING",
      urgency: "HIGH",
      instructions: "Apply 25 kg Urea + 15 kg MOP per acre before evening irrigation. Ensure soil has light standing water."
    },
    {
      id: "task_02",
      cropId: "paddy",
      cropName: "Paddy",
      category: "Irrigation",
      title: "Canal Water Scheduling Check",
      dueDate: "01 Oct 2026",
      displayDate: "01 Oct",
      status: "PENDING",
      urgency: "MEDIUM",
      instructions: "Check canal sluice rotation for Kilnathur sector. Maintain 2 inches standing water for grain development."
    },
    {
      id: "task_03",
      cropId: "groundnut",
      cropName: "Groundnut",
      category: "Crop Care",
      title: "Gypsum Application for Pod Filling",
      dueDate: "05 Oct 2026",
      displayDate: "05 Oct",
      status: "PENDING",
      urgency: "MEDIUM",
      instructions: "Apply 80 kg Gypsum per acre at root zone and lightly hoe into soil for pod calcium absorption."
    },
    {
      id: "task_04",
      cropId: "paddy",
      cropName: "Paddy",
      category: "Harvest Preparation",
      title: "Drain Field 10 Days Before Harvest",
      dueDate: "05 Nov 2026",
      displayDate: "05 Nov",
      status: "UPCOMING",
      urgency: "LOW",
      instructions: "Cut off canal irrigation to allow uniform grain drying and ease harvester tractor movement."
    }
  ],

  // Weather Information & Agricultural Implications
  weather: {
    location: "Tiruvannamalai, Tamil Nadu",
    tempC: 31,
    condition: "Partly Cloudy",
    humidity: 74,
    rainProbabilityPercent: 25,
    windKmh: 14,
    dewPoint: 22,
    forecastNext5Days: [
      { day: "Today", condition: "Partly Cloudy", tempHigh: 32, tempLow: 24, rainChance: 25 },
      { day: "Sun", condition: "Scattered Showers", tempHigh: 30, tempLow: 23, rainChance: 55 },
      { day: "Mon", condition: "Light Rain", tempHigh: 29, tempLow: 23, rainChance: 65 },
      { day: "Tue", condition: "Clearing", tempHigh: 31, tempLow: 24, rainChance: 30 },
      { day: "Wed", condition: "Sunny", tempHigh: 33, tempLow: 24, rainChance: 15 }
    ],
    // Agricultural implications
    implications: {
      harvesting: "Light rain forecast in 48-72h. Avoid cutting mature plots until Wednesday sun window.",
      irrigation: "Postpone tomorrow's planned pump cycle by 2 days to leverage expected soil moisture.",
      transport: "Cover trucks with tarpaulins if moving grain to Kanchipuram on Sunday or Monday.",
      cropCare: "High humidity may invite brown plant hopper (BPH) — scout lower tiller stems."
    }
  },

  // Farm Health Score Breakdown
  farmHealth: {
    overallScore: 82,
    statusText: "Healthy Growth Stage",
    components: [
      { name: "Crop Condition", score: 88, max: 100, status: "Good leaf color and tiller count" },
      { name: "Irrigation Balance", score: 85, max: 100, status: "Canal supply adequate, borewell recharge normal" },
      { name: "Weather Exposure Risk", score: 74, max: 100, status: "Moderate rain alertness for next 3 days" },
      { name: "Field Task Adherence", score: 80, max: 100, status: "Fertilizer schedule on track" }
    ]
  },

  // Money & Financial Ledger
  finance: {
    summary: {
      totalSalesThisSeason: 312000,
      totalReceived: 242000,
      totalPending: 70000,
      totalExpectedUpcoming: 148000
    },
    sales: [
      {
        id: "sale_01",
        date: "14 Aug 2026",
        cropName: "Paddy (Summer Harvest)",
        buyerName: "Ponni Modern Rice Mills",
        quantityQuintals: 40,
        ratePerQ: 2850,
        grossAmount: 114000,
        netReceived: 114000,
        status: "COMPLETED",
        paymentMode: "NEFT Bank Credit",
        invoiceNo: "INV-2026-0814"
      },
      {
        id: "sale_02",
        date: "04 Sep 2026",
        cropName: "Groundnut (Early Lot)",
        buyerName: "SV Oil Mills & Agro Industries",
        quantityQuintals: 18,
        ratePerQ: 7100,
        grossAmount: 127800,
        netReceived: 128000,
        status: "COMPLETED",
        paymentMode: "RTGS",
        invoiceNo: "INV-2026-0904"
      },
      {
        id: "sale_03",
        date: "19 Sep 2026",
        cropName: "Black Gram (Intercrop)",
        buyerName: "Sri Murugan Pulse Traders",
        quantityQuintals: 10,
        ratePerQ: 7000,
        grossAmount: 70000,
        netReceived: 0,
        status: "PENDING",
        expectedDate: "29 Sep 2026",
        paymentMode: "Post-Dated Cheque / Bank Transfer",
        invoiceNo: "INV-2026-0919"
      }
    ]
  },

  // Watchlist Items
  watchlist: [
    { type: "crop", id: "paddy", label: "Paddy (BPT 5204)", currentRate: "₹2,950/q", change: "+₹80" },
    { type: "mandi", id: "mandi_kanchi", label: "Kanchipuram Mandi", currentRate: "₹3,040/q", change: "+₹110" },
    { type: "mandi", id: "mandi_tvm", label: "Tiruvannamalai Mandi", currentRate: "₹2,950/q", change: "+₹80" },
    { type: "buyer", id: "buyer_01", label: "Ponni Modern Rice Mills", currentRate: "Offers ₹3,050/q", change: "Verified" }
  ],

  // Saved Price Alerts
  alerts: [
    {
      id: "alert_01",
      cropName: "Paddy",
      condition: "Crosses Above",
      targetPrice: 3000,
      active: true,
      createdDate: "15 Sep 2026",
      notifyVia: "SMS & In-App"
    },
    {
      id: "alert_02",
      cropName: "Paddy",
      condition: "Falls Below",
      targetPrice: 2800,
      active: true,
      createdDate: "10 Sep 2026",
      notifyVia: "In-App"
    },
    {
      id: "alert_03",
      cropName: "Groundnut",
      condition: "Crosses Above",
      targetPrice: 7300,
      active: true,
      createdDate: "18 Sep 2026",
      notifyVia: "SMS & In-App"
    }
  ],

  // Government Support Schemes (Filterable & Verified)
  governmentSupport: [
    {
      id: "gov_01",
      title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      category: "Income Support",
      scope: "Central Government",
      state: "All India",
      benefit: "₹6,000 per year in three 4-monthly installments of ₹2,000",
      eligibilitySummary: "All landholding farmer families with cultivable land in their names.",
      verificationStatus: "OFFICIAL_SCHEME",
      officialSourceUrl: "https://pmkisan.gov.in",
      farmerStatus: "ENROLLED (Next installment due: Nov 2026)"
    },
    {
      id: "gov_02",
      title: "PM Fasal Bima Yojana (PMFBY)",
      category: "Crop Insurance",
      scope: "Central + State",
      state: "Tamil Nadu",
      benefit: "Comprehensive risk insurance from pre-sowing to post-harvest loss at 1.5% - 2% premium.",
      eligibilitySummary: "All farmers growing notified crops in notified areas. Mandatory for loanee farmers.",
      verificationStatus: "OFFICIAL_SCHEME",
      officialSourceUrl: "https://pmfby.gov.in",
      farmerStatus: "ENROLLED for Samba Paddy 2026"
    },
    {
      id: "gov_03",
      title: "Agriculture Infrastructure Fund (AIF)",
      category: "Post-Harvest Infrastructure",
      scope: "Central Government",
      state: "All India",
      benefit: "Medium-long term debt financing for post-harvest management projects with 3% interest subvention.",
      eligibilitySummary: "Farmers, FPOs, PACS, Agri-entrepreneurs setting up dryers, packhouses, cold stores.",
      verificationStatus: "OFFICIAL_SCHEME",
      officialSourceUrl: "https://agriinfra.dac.gov.in",
      farmerStatus: "ELIGIBLE VIA FPO"
    },
    {
      id: "gov_04",
      title: "Kalaignarin All Village Integrated Agriculture Development Scheme",
      category: "State Welfare & Machinery",
      scope: "State Government",
      state: "Tamil Nadu",
      benefit: "Free electric motor/submersible pump connection subsidy, drip irrigation subsidy up to 100%.",
      eligibilitySummary: "Small and marginal farmers of Tamil Nadu in selected village panchayats.",
      verificationStatus: "OFFICIAL_SCHEME",
      officialSourceUrl: "https://www.tn.gov.in/department/1",
      farmerStatus: "APPLY AT LOCAL VAO / ADA OFFICE"
    },
    {
      id: "gov_05",
      title: "Sub-Mission on Agricultural Mechanization (SMAM)",
      category: "Farm Machinery Subsidy",
      scope: "Central + State",
      state: "Tamil Nadu",
      benefit: "40% to 50% subsidy on procurement of paddy transplanters, combine harvesters, and rotavators.",
      eligibilitySummary: "Registered farmers with valid land records and Aadhaar.",
      verificationStatus: "OFFICIAL_SCHEME",
      officialSourceUrl: "https://agrimachinery.nic.in",
      farmerStatus: "BOOKING OPEN VIA AGRISNET PORTAL"
    }
  ],

  // Financial Support Services
  financialSupport: [
    {
      id: "fin_01",
      title: "Kisan Credit Card (KCC) Limit Enhancement",
      institution: "State Bank of India / NABARD",
      benefit: "Short-term crop credit at 4% effective interest with prompt repayment incentive.",
      guidance: "Current sanctioned limit: ₹1,80,000. Eligible for renewal up to ₹2,40,000 based on scale of finance."
    },
    {
      id: "fin_02",
      title: "Electronic Negotiable Warehouse Receipt (e-NWR) Pledge Loan",
      institution: "NABARD / WDRA Regulated Warehouses",
      benefit: "Pledge stored produce in accredited warehouse to get up to 75% of produce value as low-cost loan.",
      guidance: "Helps farmers avoid distress sales immediately after harvest when market supply is high."
    },
    {
      id: "fin_03",
      title: "Post-Harvest Pledge Financing for FPOs",
      institution: "Samunnati / Nabkisan",
      benefit: "Working capital loans against procurement orders for collective selling.",
      guidance: "Allows farmers collective transport to Kanchipuram or Chennai to realize higher wholesale margins."
    }
  ],

  // Knowledge Base Articles
  knowledgeArticles: [
    {
      id: "kb_01",
      category: "Quality & Grading",
      title: "How to Measure Paddy Moisture Without a Digital Meter",
      readingTime: "3 min read",
      summary: "Understand the traditional thumb-press and tooth-bite test to ensure moisture is within the 14% FAQ procurement standard.",
      content: "Mandi commission agents and millers will deduct ₹40–₹80 per quintal if paddy moisture exceeds 15%. To test grain manually: take 10 grains, press them with your thumbnail. If the grain indents without snapping crisp, moisture is over 16%. If it gives a sharp snap sound with clean split, it is safely in the 13–14% safe zone."
    },
    {
      id: "kb_02",
      category: "Market & Selling",
      title: "Gross Mandi Rate vs. Net Value: Why the Highest Mandi Isn't Always Best",
      readingTime: "4 min read",
      summary: "Learn how lorry freight, toll charges, bag stitching, loading fees, and mandi cess impact your actual take-home return.",
      content: "Many farmers travel 80 km for a rate that is ₹80 higher on paper, only to spend ₹110 per quintal on diesel and driver allowances. AgriNova's Net Realisable Value calculator accounts for transport distance, lorry capacity, and handling fees so you know your exact net profit before leaving your village."
    },
    {
      id: "kb_03",
      category: "Storage",
      title: "Hermetic Bag Storage for Groundnut Pods",
      readingTime: "4 min read",
      summary: "Prevent aflatoxin mold and bruchid pest infestation during the 30-day post-harvest holding window.",
      content: "Groundnut held for better prices must be dried to 8% kernel moisture. Using multi-layer hermetic bags (PICS bags) stops oxygen exchange and preserves germination and high oil percentage without chemical fumigants."
    },
    {
      id: "kb_04",
      category: "Selling Guides",
      title: "Direct Buyer Contracting Checklist: Protecting Yourself Against Delayed Payments",
      readingTime: "5 min read",
      summary: "Five essential safeguards before delivering grain to private millers or wholesale aggregators.",
      content: "1. Demand a signed weighbridge slip from a government certified scale. 2. Verify payment terms in writing (advance or within 48h). 3. Retain a 500g sealed counter-sample of grain. 4. Use AgriNova verified buyer badges. 5. Confirm buyer GSTIN or FSSAI registration."
    }
  ],

  // Login History (for Security & Level 4 Account)
  loginHistory: [
    {
      id: "sess_01",
      device: "Google Chrome on Windows 11 (This Device)",
      location: "Tiruvannamalai, Tamil Nadu, India",
      ip: "157.48.192.84",
      dateTime: "Today, 02:45 PM",
      status: "ACTIVE_CURRENT"
    },
    {
      id: "sess_02",
      device: "AgriNova Mobile App on Samsung Galaxy M34",
      location: "Tiruvannamalai, Tamil Nadu, India",
      ip: "157.48.192.112",
      dateTime: "Yesterday, 07:15 AM",
      status: "COMPLETED"
    },
    {
      id: "sess_03",
      device: "Mobile Chrome on Android 14",
      location: "Vellore, Tamil Nadu, India",
      ip: "49.37.112.44",
      dateTime: "22 Sep 2026, 06:12 PM",
      status: "COMPLETED"
    }
  ],

  // Recent Activity Feed for Dashboard
  recentActivity: [
    {
      id: "act_1",
      type: "offer",
      title: "Buyer Offer Received",
      desc: "Ponni Modern Rice Mills made an offer of ₹3,040/q for your 50q Paddy listing.",
      time: "2 hours ago"
    },
    {
      id: "act_2",
      type: "price",
      title: "Market Price Updated",
      desc: "Tiruvannamalai Mandi Paddy modal rate rose +₹80 to ₹2,950/q.",
      time: "10:35 AM"
    },
    {
      id: "act_3",
      type: "listing",
      title: "Listing Created",
      desc: "50 quintals BPT 5204 Paddy listed for prospective buyers.",
      time: "20 Sep 2026"
    },
    {
      id: "act_4",
      type: "payment",
      title: "Payment Received",
      desc: "₹1,27,800 received from SV Oil Mills for Groundnut sale.",
      time: "04 Sep 2026"
    },
    {
      id: "act_5",
      type: "task",
      title: "Task Completed",
      desc: "Canal inlet weeding completed for Paddy Field A.",
      time: "18 Sep 2026"
    }
  ]
};
