/**
 * AgriNova Platform - AI Forecast Projection Chart
 * Visually separates Observed Historical Data from Estimated Future Forecast Ranges
 * with a confidence uncertainty corridor (Requirements 25 & 26).
 */

export class ForecastChart {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext("2d");
    this.width = 600;
    this.height = 260;
    this.initEvents();
  }

  initEvents() {
    window.addEventListener("resize", () => this.resize());
    setTimeout(() => this.resize(), 50);
  }

  resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width || 600;
    const height = Math.max(240, rect.height || 260);

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(dpr, dpr);
    this.width = width;
    this.height = height;

    this.render();
  }

  setData(historicalPoints, forecastPeriods, currentPrice) {
    this.historical = (historicalPoints || []).slice(-10); // last 10 historical points
    this.forecast = forecastPeriods || [];
    this.currentPrice = currentPrice;
    this.render();
  }

  render() {
    if (!this.ctx || !this.width || !this.height) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    if (!this.historical || this.historical.length === 0 || !this.forecast) return;

    const padL = 55;
    const padR = 30;
    const padT = 30;
    const padB = 40;
    const plotW = this.width - padL - padR;
    const plotH = this.height - padT - padB;

    // Combine values to find min and max
    const histPrices = this.historical.map((p) => p.price);
    const foreMin = this.forecast.map((f) => f.min);
    const foreMax = this.forecast.map((f) => f.max);

    const allMin = Math.min(...histPrices, ...foreMin);
    const allMax = Math.max(...histPrices, ...foreMax);
    const minVal = Math.floor(allMin * 0.98);
    const maxVal = Math.ceil(allMax * 1.02);
    const valRange = maxVal - minVal || 1;

    const getY = (val) => padT + plotH - ((val - minVal) / valRange) * plotH;

    // Split plot width: 45% Historical, 55% Forecast
    const splitX = padL + plotW * 0.42;

    // 1. Draw horizontal grid lines & Y labels
    ctx.font = "11px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "#6B7280";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let i = 0; i <= 4; i++) {
      const val = Math.round(minVal + (i / 4) * valRange);
      const y = getY(val);

      ctx.strokeStyle = "#EAEFE6";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(this.width - padR, y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillText(`₹${val.toLocaleString("en-IN")}`, padL - 8, y);
    }

    // 2. Draw Historical vs Forecast Divider Line
    ctx.strokeStyle = "#C87A1E";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(splitX, padT);
    ctx.lineTo(splitX, padT + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Category labels at top
    ctx.font = "bold 10px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "#1B4D3E";
    ctx.textAlign = "center";
    ctx.fillText("HISTORICAL (ACTUAL)", padL + (splitX - padL) / 2, padT - 12);

    ctx.fillStyle = "#C87A1E";
    ctx.fillText("AI FORECAST RANGE (ESTIMATED)", splitX + (this.width - padR - splitX) / 2, padT - 12);

    // 3. Historical Line Coordinates
    const histStep = (splitX - padL) / (this.historical.length - 1 || 1);
    const histCoords = this.historical.map((pt, i) => ({
      x: padL + i * histStep,
      y: getY(pt.price),
      data: pt
    }));

    // Draw Historical solid green line
    ctx.strokeStyle = "#1B4D3E";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(histCoords[0].x, histCoords[0].y);
    for (let i = 1; i < histCoords.length; i++) {
      ctx.lineTo(histCoords[i].x, histCoords[i].y);
    }
    ctx.stroke();

    // 4. Forecast Points Coordinates
    const foreStep = (this.width - padR - splitX) / this.forecast.length;
    const foreCoords = this.forecast.map((f, i) => ({
      x: splitX + (i + 1) * foreStep,
      yMid: getY(f.mid),
      yMin: getY(f.min),
      yMax: getY(f.max),
      data: f
    }));

    // Anchor forecast start at the last historical point
    const anchor = histCoords[histCoords.length - 1];

    // Draw Shaded Uncertainty Corridor
    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y);
    for (let i = 0; i < foreCoords.length; i++) {
      ctx.lineTo(foreCoords[i].x, foreCoords[i].yMax);
    }
    for (let i = foreCoords.length - 1; i >= 0; i--) {
      ctx.lineTo(foreCoords[i].x, foreCoords[i].yMin);
    }
    ctx.lineTo(anchor.x, anchor.y);
    ctx.closePath();
    ctx.fillStyle = "rgba(200, 122, 30, 0.12)";
    ctx.fill();

    // Draw Upper & Lower Bound Dashed Corridor Lines
    ctx.strokeStyle = "rgba(200, 122, 30, 0.5)";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y);
    for (let i = 0; i < foreCoords.length; i++) ctx.lineTo(foreCoords[i].x, foreCoords[i].yMax);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y);
    for (let i = 0; i < foreCoords.length; i++) ctx.lineTo(foreCoords[i].x, foreCoords[i].yMin);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Projected Median Forecast Line (dashed gold/amber)
    ctx.strokeStyle = "#C87A1E";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y);
    for (let i = 0; i < foreCoords.length; i++) {
      ctx.lineTo(foreCoords[i].x, foreCoords[i].yMid);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Markers on Forecast Points
    foreCoords.forEach((pt) => {
      ctx.fillStyle = "#C87A1E";
      ctx.beginPath();
      ctx.arc(pt.x, pt.yMid, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Range text above point
      ctx.font = "9px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "#7A4D14";
      ctx.textAlign = "center";
      ctx.fillText(pt.data.timeframe, pt.x, padT + plotH + 12);
      ctx.fillText(pt.data.range.replace(" – ", "-"), pt.x, pt.yMax - 8);
    });

    // Draw marker at current transition
    ctx.fillStyle = "#1B4D3E";
    ctx.beginPath();
    ctx.arc(anchor.x, anchor.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#1B4D3E";
    ctx.font = "bold 10px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Today", anchor.x, padT + plotH + 12);
  }
}
