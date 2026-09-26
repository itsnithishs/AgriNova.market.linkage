/**
 * AgriNova Platform - Financial Summary Charts
 * Visualizes season sales, crop-wise income, and pending vs received split (Req 52).
 */

export class FinanceBarChart {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext("2d");
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
    const width = rect.width || 400;
    const height = Math.max(200, rect.height || 220);

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(dpr, dpr);
    this.width = width;
    this.height = height;

    this.render();
  }

  setData(salesData) {
    this.sales = salesData || [];
    this.render();
  }

  render() {
    if (!this.ctx || !this.width || !this.height) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    if (!this.sales || this.sales.length === 0) return;

    const padL = 45;
    const padR = 20;
    const padT = 20;
    const padB = 40;
    const plotW = this.width - padL - padR;
    const plotH = this.height - padT - padB;

    const maxVal = Math.max(...this.sales.map((s) => s.grossAmount), 150000);
    const getY = (val) => padT + plotH - (val / maxVal) * plotH;

    // Grid lines
    ctx.font = "10px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "#6B7280";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let i = 0; i <= 3; i++) {
      const val = Math.round((i / 3) * maxVal);
      const y = getY(val);

      ctx.strokeStyle = "#EAEFE6";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(this.width - padR, y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillText(`₹${(val / 1000).toFixed(0)}k`, padL - 8, y);
    }

    // Bars
    const barCount = this.sales.length;
    const barWidth = Math.min(48, (plotW / barCount) * 0.6);
    const step = plotW / barCount;

    this.sales.forEach((sale, i) => {
      const x = padL + i * step + (step - barWidth) / 2;
      const y = getY(sale.grossAmount);
      const barH = padT + plotH - y;

      // Color depends on received vs pending
      ctx.fillStyle = sale.status === "COMPLETED" ? "#1B4D3E" : "#D9822B";

      // Rounded top bar
      const r = 4;
      ctx.beginPath();
      ctx.moveTo(x, padT + plotH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x + barWidth - r, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
      ctx.lineTo(x + barWidth, padT + plotH);
      ctx.closePath();
      ctx.fill();

      // Label below bar
      ctx.fillStyle = "#374151";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.font = "10px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(sale.cropName.split(" ")[0], x + barWidth / 2, padT + plotH + 8);

      // Amount above bar
      ctx.fillStyle = "#111827";
      ctx.font = "bold 10px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(`₹${(sale.grossAmount / 1000).toFixed(0)}k`, x + barWidth / 2, y - 14);
    });
  }
}
