// Chart Renderer - Canvas-based chart rendering
class ChartRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = canvasId;
        }
        this.ctx = this.canvas.getContext('2d');
        this.padding = { top: 40, right: 40, bottom: 60, left: 80 };
    }

    renderEquityCurve(equityData) {
        const width = this.canvas.width = 1000;
        const height = this.canvas.height = 400;
        const ctx = this.ctx;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Calculate chart dimensions
        const chartWidth = width - this.padding.left - this.padding.right;
        const chartHeight = height - this.padding.top - this.padding.bottom;

        // Find min and max values
        const balances = equityData.map(d => d.balance);
        const minBalance = Math.min(...balances);
        const maxBalance = Math.max(...balances);
        const balanceRange = maxBalance - minBalance;

        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(this.padding.left, this.padding.top, chartWidth, chartHeight);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = this.padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(this.padding.left, y);
            ctx.lineTo(this.padding.left + chartWidth, y);
            ctx.stroke();
        }

        // Draw Y-axis labels
        ctx.fillStyle = '#9fa8da';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = maxBalance - (balanceRange / 5) * i;
            const y = this.padding.top + (chartHeight / 5) * i;
            ctx.fillText(value.toFixed(2), this.padding.left - 10, y + 4);
        }

        // Draw equity line
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        ctx.beginPath();

        equityData.forEach((point, index) => {
            const x = this.padding.left + (chartWidth / (equityData.length - 1)) * index;
            const y = this.padding.top + chartHeight -
                ((point.balance - minBalance) / balanceRange) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw gradient fill
        const gradient = ctx.createLinearGradient(0, this.padding.top, 0, this.padding.top + chartHeight);
        gradient.addColorStop(0, 'rgba(0, 229, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw title
        ctx.fillStyle = '#e8eaf6';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Equity Curve', width / 2, 25);

        // Draw X-axis label
        ctx.fillStyle = '#9fa8da';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText('Trade Number', width / 2, height - 20);

        return this.canvas;
    }

    renderHourlyPerformance(hourlyData) {
        const width = this.canvas.width = 1000;
        const height = this.canvas.height = 400;
        const ctx = this.ctx;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Calculate chart dimensions
        const chartWidth = width - this.padding.left - this.padding.right;
        const chartHeight = height - this.padding.top - this.padding.bottom;
        const barWidth = chartWidth / 24;

        // Find max value for scaling
        const maxValue = Math.max(...hourlyData.map(h => Math.max(h.wins, h.losses)));

        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(this.padding.left, this.padding.top, chartWidth, chartHeight);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = this.padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(this.padding.left, y);
            ctx.lineTo(this.padding.left + chartWidth, y);
            ctx.stroke();
        }

        // Draw bars
        hourlyData.forEach((data, index) => {
            const x = this.padding.left + index * barWidth;
            const centerY = this.padding.top + chartHeight / 2;

            // Draw wins (upward)
            if (data.wins > 0) {
                const winHeight = (data.wins / maxValue) * (chartHeight / 2) * 0.9;
                ctx.fillStyle = '#00e676';
                ctx.fillRect(x + 2, centerY - winHeight, barWidth - 4, winHeight);
            }

            // Draw losses (downward)
            if (data.losses > 0) {
                const lossHeight = (data.losses / maxValue) * (chartHeight / 2) * 0.9;
                ctx.fillStyle = '#ff5252';
                ctx.fillRect(x + 2, centerY, barWidth - 4, lossHeight);
            }

            // Draw hour label
            if (index % 2 === 0) {
                ctx.fillStyle = '#9fa8da';
                ctx.font = '10px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(data.hour.toString(), x + barWidth / 2, height - 30);
            }
        });

        // Draw center line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.padding.left, this.padding.top + chartHeight / 2);
        ctx.lineTo(this.padding.left + chartWidth, this.padding.top + chartHeight / 2);
        ctx.stroke();

        // Draw title
        ctx.fillStyle = '#e8eaf6';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Hourly Win/Loss Distribution', width / 2, 25);

        // Draw legend
        ctx.fillStyle = '#00e676';
        ctx.fillRect(width - 150, 10, 15, 15);
        ctx.fillStyle = '#e8eaf6';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Wins', width - 130, 22);

        ctx.fillStyle = '#ff5252';
        ctx.fillRect(width - 70, 10, 15, 15);
        ctx.fillStyle = '#e8eaf6';
        ctx.fillText('Losses', width - 50, 22);

        // Draw X-axis label
        ctx.fillStyle = '#9fa8da';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Hour of Day (UTC)', width / 2, height - 10);

        return this.canvas;
    }
}

window.ChartRenderer = ChartRenderer;
