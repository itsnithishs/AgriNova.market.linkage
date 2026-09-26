/**
 * AgriNova Platform - Interactive Canvas Price Chart
 * High-performance, zero-dependency HTML5 Canvas with smooth curves,
 * crosshair tracking, tooltips, average line, and clickable point signal inspection.
 */

export class PriceChart {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext("2d");
    this.options = {
      lineColor: "#1B4D3E", // AgriNova Deep Emerald
      fillColor: "rgba(27, 77, 62, 0.08)",
      avgLineColor: "#C87A1E", // Warm Agricultural Gold
      pointColor: "#1B4D3E",
      highlightPointColor: "#D9822B",
      gridColor: "#EAEFE6",
      textColor: "#5F6E65",
      font: "11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      onPointClick: options.onPointClick || null,
      ...options
    };

    this.dataPoints = [];
    this.hoverIndex = -1;
    this.selectedIndex = -1;
    this.animationProgress = 1;

    this.initEvents();
  }

  setData(dataPoints, averagePrice = null) {
    this.dataPoints = dataPoints || [];
    this.averagePrice = averagePrice;
    this.hoverIndex = -1;
    this.render();
  }

  initEvents() {
    const handleMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const index = this.getClosestIndex(x);
      if (index !== this.hoverIndex) {
        this.hoverIndex = index;
        this.render();
      }
    };

    const handleLeave = () => {
      if (this.hoverIndex !== -1) {
        this.hoverIndex = -1;
        this.render();
      }
    };

    const handleClick = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      const index = this.getClosestIndex(x);
      if (index >= 0 && index < this.dataPoints.length) {
        this.selectedIndex = index;
        this.render();
        if (typeof this.options.onPointClick === "function") {
          this.options.onPointClick(this.dataPoints[index]);
        }
      }
    };

    this.canvas.addEventListener("mousemove", handleMove);
    this.canvas.addEventListener("mouseleave", handleLeave);
    this.canvas.addEventListener("click", handleClick);
    this.canvas.addEventListener("touchmove", handleMove, { passive: true });
    this.canvas.addEventListener("touchend", handleClick);

    window.addEventListener("resize", () => this.resize());
    setTimeout(() => this.resize(), 50);
  }

  resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width || 600;
    const height = Math.max(260, rect.height || 280);

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(dpr, dpr);
    this.width = width;
    this.height = height;

    this.render();
  }

  getClosestIndex(mouseX) {
    if (!this.dataPoints || this.dataPoints.length === 0) return -1;
    const padL = 50;
    const padR = 25;
    const plotWidth = this.width - padL - padR;
    const step = plotWidth / (this.dataPoints.length - 1 || 1);

    let closest = 0;
    let minDiff = Infinity;
    for (let i = 0; i < this.dataPoints.length; i++) {
      const px = padL + i * step;
      const diff = Math.abs(px - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    }
    return closest;
  }

  render() {
    if (!this.ctx || !this.width || !this.height) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    if (!this.dataPoints || this.dataPoints.length === 0) {
      ctx.fillStyle = this.options.textColor;
      ctx.font = this.options.font;
      ctx.textAlign = "center";
      ctx.fillText("No price data available for selected period", this.width / 2, this.height / 2);
      return;
    }

    const padL = 55;
    const padR = 30;
    const padT = 30;
    const padB = 40;
    const plotW = this.width - padL - padR;
    const plotH = this.height - padT - padB;

    const prices = this.dataPoints.map((p) => p.price);
    const minVal = Math.floor(Math.min(...prices) * 0.985);
    const maxVal = Math.ceil(Math.max(...prices) * 1.015);
    const valRange = maxVal - minVal || 1;

    // Y Axis Coordinates function
    const getY = (val) => padT + plotH - ((val - minVal) / valRange) * plotH;
    const getX = (idx) => padL + (idx / (this.dataPoints.length - 1 || 1)) * plotW;

    // 1. Draw Grid lines and Y Axis Labels
    ctx.font = this.options.font;
    ctx.fillStyle = this.options.textColor;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    const yTicks = 4;
    for (let i = 0; i <= yTicks; i++) {
      const val = Math.round(minVal + (i / yTicks) * valRange);
      const y = getY(val);

      ctx.strokeStyle = this.options.gridColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(this.width - padR, y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillText(`₹${val.toLocaleString("en-IN")}`, padL - 8, y);
    }

    // 2. Draw Average Reference Line (Requirement 22)
    if (this.averagePrice && this.averagePrice >= minVal && this.averagePrice <= maxVal) {
      const avgY = getY(this.averagePrice);
      ctx.strokeStyle = this.options.avgLineColor;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(padL, avgY);
      ctx.lineTo(this.width - padR, avgY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = this.options.avgLineColor;
      ctx.textAlign = "right";
      ctx.fillText(`30D Avg ₹${Math.round(this.averagePrice)}`, this.width - padR, avgY - 8);
    }

    // 3. Compute Coordinates
    const coords = this.dataPoints.map((pt, i) => ({
      x: getX(i),
      y: getY(pt.price),
      data: pt
    }));

    // 4. Fill Area Gradient under Curve
    const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
    grad.addColorStop(0, "rgba(27, 77, 62, 0.18)");
    grad.addColorStop(1, "rgba(27, 77, 62, 0.01)");

    ctx.beginPath();
    ctx.moveTo(coords[0].x, padT + plotH);
    ctx.lineTo(coords[0].x, coords[0].y);

    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const mx = (curr.x + next.x) / 2;
      ctx.bezierCurveTo(mx, curr.y, mx, next.y, next.x, next.y);
    }

    ctx.lineTo(coords[coords.length - 1].x, padT + plotH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // 5. Draw Price Line
    ctx.strokeStyle = this.options.lineColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);

    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const mx = (curr.x + next.x) / 2;
      ctx.bezierCurveTo(mx, curr.y, mx, next.y, next.x, next.y);
    }
    ctx.stroke();

    // 6. Draw X Axis Labels (Dates)
    ctx.fillStyle = this.options.textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const xLabelStep = Math.max(1, Math.floor(coords.length / 5));

    for (let i = 0; i < coords.length; i += xLabelStep) {
      const pt = coords[i];
      ctx.fillText(pt.data.date, pt.x, padT + plotH + 8);
    }
    // Always render last date if not rendered
    const lastIdx = coords.length - 1;
    if (lastIdx % xLabelStep !== 0) {
      ctx.fillText(coords[lastIdx].data.date, coords[lastIdx].x, padT + plotH + 8);
    }

    // 7. Draw Current Price Dot Marker on latest point (Requirement 22)
    const latest = coords[coords.length - 1];
    ctx.fillStyle = this.options.lineColor;
    ctx.beginPath();
    ctx.arc(latest.x, latest.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 8. Hover Crosshair & Interactive Tooltip (Requirement 22 & 23)
    const activeIdx = this.hoverIndex !== -1 ? this.hoverIndex : this.selectedIndex;
    if (activeIdx >= 0 && activeIdx < coords.length) {
      const pt = coords[activeIdx];

      // Vertical guide line
      ctx.strokeStyle = "rgba(27, 77, 62, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(pt.x, padT);
      ctx.lineTo(pt.x, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Highlight circle
      ctx.fillStyle = this.options.highlightPointColor;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Tooltip Card
      this.drawTooltip(ctx, pt.data, pt.x, pt.y, padL, plotW);
    }
  }

  drawTooltip(ctx, data, x, y, padL, plotW) {
    const tipW = 160;
    const tipH = 56;
    let tipX = x - tipW / 2;
    if (tipX < padL) tipX = padL;
    if (tipX + tipW > this.width - 20) tipX = this.width - 20 - tipW;
    let tipY = y - tipH - 12;
    if (tipY < 10) tipY = y + 16;

    // Card background
    ctx.fillStyle = "#183D31"; // Dark forest green
    ctx.shadowColor = "rgba(0,0,0,0.18)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    // Rounded rectangle
    const r = 6;
    ctx.beginPath();
    ctx.moveTo(tipX + r, tipY);
    ctx.lineTo(tipX + tipW - r, tipY);
    ctx.quadraticCurveTo(tipX + tipW, tipY, tipX + tipW, tipY + r);
    ctx.lineTo(tipX + tipW, tipY + tipH - r);
    ctx.quadraticCurveTo(tipX + tipW, tipY + tipH, tipX + tipW - r, tipY + tipH);
    ctx.lineTo(tipX + r, tipY + tipH);
    ctx.quadraticCurveTo(tipX, tipY + tipH, tipX, tipY + tipH - r);
    ctx.lineTo(tipX, tipY + r);
    ctx.quadraticCurveTo(tipX, tipY, tipX + r, tipY);
    ctx.closePath();
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = "transparent";

    // Text content
    ctx.fillStyle = "#E4EAE4";
    ctx.font = "10px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(data.date, tipX + 12, tipY + 8);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`₹${data.price.toLocaleString("en-IN")}/q`, tipX + 12, tipY + 23);

    const changeTxt = data.change >= 0 ? `+₹${data.change}` : `-₹${Math.abs(data.change)}`;
    ctx.fillStyle = data.change >= 0 ? "#78D68D" : "#FF9999";
    ctx.font = "11px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(changeTxt, tipX + tipW - 12, tipY + 23);

    ctx.fillStyle = "#C8D6CD";
    ctx.font = "9px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Click for market signals", tipX + 12, tipY + 40);
  }
}

/**
 * Generate historical price series dynamically for any crop & timeframe
 */
export function generatePriceSeries(commodity, timeframe, mandi) {
  const basePrice = mandi ? mandi.pricePerQ : commodity.currentPrice;
  const count = timeframe === "7D" ? 7 : timeframe === "30D" ? 30 : timeframe === "3M" ? 90 : timeframe === "6M" ? 180 : 365;

  const points = [];
  const today = new Date(2026, 8, 26); // 26 Sep 2026

  let rollingPrice = basePrice - (timeframe === "7D" ? 60 : timeframe === "30D" ? 140 : 250);

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    // Controlled pseudo-random walk anchored to current base price at i = 0
    const dayFactor = (count - i) / count;
    const noise = Math.sin(i * 0.45) * 22 + (Math.cos(i * 0.2) * 18);
    const price = Math.round(rollingPrice + dayFactor * (basePrice - rollingPrice) + noise);
    const prevPrice = points.length > 0 ? points[points.length - 1].price : price - 15;
    const change = price - prevPrice;

    // Realistic date label format
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const dateStr = `${day} ${month}`;

    // Contextual contributing signals for this point (Req 23)
    let possibleSignals = [];
    if (change > 30) {
      possibleSignals = ["Lower mandi arrivals due to regional rainfall", "Bulk procurement order from local rice mill", "Increased festival market demand"];
    } else if (change < -25) {
      possibleSignals = ["Temporary surge in harvest arrivals", "Higher moisture level in incoming lots", "Sluggish dispatch due to transport bottlenecks"];
    } else {
      possibleSignals = ["Balanced trade demand and arrival volume", "Stable mandi benchmark trading", "Normal procurement pace"];
    }

    points.push({
      date: dateStr,
      fullDate: d.toDateString(),
      price: i === 0 ? basePrice : price,
      change: i === 0 ? commodity.change : change,
      volumeTonnes: Math.round(350 + Math.sin(i) * 90),
      possibleSignals
    });
  }

  return points;
}
