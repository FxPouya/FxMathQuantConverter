// Report Generator - Generate comprehensive HTML reports
class ReportGenerator {
    constructor(strategy) {
        this.strategy = strategy;
        this.analytics = new Analytics(strategy);
    }

    generateHTML() {
        const basicStats = this.analytics.getBasicStats();
        const tradeStats = this.analytics.getTradeStats();
        const hourlyData = this.analytics.getHourlyPerformance();
        const { bestHours, worstHours } = this.analytics.getBestWorstHours();
        const equityCurve = this.analytics.getEquityCurve();

        // Generate charts
        const equityChart = new ChartRenderer('equityChart');
        const equityCanvas = equityChart.renderEquityCurve(equityCurve);
        const equityDataURL = equityCanvas.toDataURL();

        const hourlyChart = new ChartRenderer('hourlyChart');
        const hourlyCanvas = hourlyChart.renderHourlyPerformance(hourlyData);
        const hourlyDataURL = hourlyCanvas.toDataURL();

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Strategy Performance Report - ${this.strategy.parameters.symbol}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0a0e27 0%, #151932 100%);
            color: #e8eaf6;
            padding: 2rem;
            line-height: 1.6;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        h1 {
            font-size: 2.5rem;
            background: linear-gradient(135deg, #00e5ff 0%, #7c4dff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }
        h2 {
            color: #00e5ff;
            margin: 2rem 0 1rem;
            font-size: 1.8rem;
            border-bottom: 2px solid rgba(0, 229, 255, 0.3);
            padding-bottom: 0.5rem;
        }
        h3 {
            color: #7c4dff;
            margin: 1.5rem 0 1rem;
            font-size: 1.3rem;
        }
        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem;
            background: rgba(30, 35, 60, 0.6);
            border-radius: 16px;
            backdrop-filter: blur(10px);
        }
        .subtitle {
            color: #9fa8da;
            font-size: 1.1rem;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        .stat-card {
            background: rgba(30, 35, 60, 0.6);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
        }
        .stat-label {
            color: #9fa8da;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        .stat-value {
            font-size: 1.8rem;
            font-weight: 700;
            color: #00e5ff;
        }
        .positive { color: #00e676; }
        .negative { color: #ff5252; }
        .chart-container {
            background: rgba(30, 35, 60, 0.6);
            padding: 2rem;
            border-radius: 16px;
            margin: 2rem 0;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .chart-container img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 2rem 0;
            background: rgba(30, 35, 60, 0.6);
            border-radius: 12px;
            overflow: hidden;
        }
        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        th {
            background: rgba(0, 229, 255, 0.1);
            color: #00e5ff;
            font-weight: 600;
        }
        tr:hover { background: rgba(255, 255, 255, 0.03); }
        .hours-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 1rem 0;
        }
        .hour-item {
            background: rgba(30, 35, 60, 0.6);
            padding: 1rem;
            border-radius: 8px;
            border-left: 3px solid #00e5ff;
        }
        .footer {
            text-align: center;
            margin-top: 3rem;
            padding: 2rem;
            color: #5c6bc0;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Strategy Performance Report</h1>
            <p class="subtitle">${this.strategy.parameters.symbol} - Generated on ${new Date().toLocaleString()}</p>
        </div>

        <h2>Summary Statistics</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Trades</div>
                <div class="stat-value">${basicStats.totalTrades}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Win Rate</div>
                <div class="stat-value ${basicStats.winRate >= 50 ? 'positive' : 'negative'}">
                    ${basicStats.winRate.toFixed(2)}%
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Profit Factor</div>
                <div class="stat-value ${basicStats.profitFactor >= 1 ? 'positive' : 'negative'}">
                    ${basicStats.profitFactor.toFixed(2)}
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Profit</div>
                <div class="stat-value ${basicStats.totalProfit >= 0 ? 'positive' : 'negative'}">
                    ${(basicStats.totalProfit * 100).toFixed(2)}
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Gross Profit</div>
                <div class="stat-value positive">${(basicStats.grossProfit * 100).toFixed(2)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Gross Loss</div>
                <div class="stat-value negative">${(basicStats.grossLoss * 100).toFixed(2)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Max Drawdown</div>
                <div class="stat-value negative">${(basicStats.maxDrawdown * 100).toFixed(4)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Final Balance</div>
                <div class="stat-value">${basicStats.finalBalance.toFixed(2)}</div>
            </div>
        </div>

        <h2>Trade Statistics</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Largest Win</div>
                <div class="stat-value positive">${(tradeStats.largestWin * 100).toFixed(4)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Largest Loss</div>
                <div class="stat-value negative">${(tradeStats.largestLoss * 100).toFixed(4)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Average Win</div>
                <div class="stat-value positive">${(tradeStats.averageWin * 100).toFixed(4)}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Average Loss</div>
                <div class="stat-value negative">${(tradeStats.averageLoss * 100).toFixed(4)}</div>
            </div>
        </div>

        <h2>Equity Curve</h2>
        <div class="chart-container">
            <img src="${equityDataURL}" alt="Equity Curve">
        </div>

        <h2>Hourly Performance Analysis</h2>
        <div class="chart-container">
            <img src="${hourlyDataURL}" alt="Hourly Performance">
        </div>

        <h3>Best Performing Hours</h3>
        <div class="hours-list">
            ${bestHours.map(h => `
                <div class="hour-item">
                    <strong>Hour ${h.hour}:00 Broker Time</strong><br>
                    Trades: ${h.trades}<br>
                    Wins: <span class="positive">${h.wins}</span> | 
                    Losses: <span class="negative">${h.losses}</span><br>
                    Profit: <span class="${h.totalProfit >= 0 ? 'positive' : 'negative'}">
                        ${(h.totalProfit * 100).toFixed(4)}
                    </span>
                </div>
            `).join('')}
        </div>

        <h3>Worst Performing Hours</h3>
        <div class="hours-list">
            ${worstHours.map(h => `
                <div class="hour-item">
                    <strong>Hour ${h.hour}:00 Broker Time</strong><br>
                    Trades: ${h.trades}<br>
                    Wins: <span class="positive">${h.wins}</span> | 
                    Losses: <span class="negative">${h.losses}</span><br>
                    Profit: <span class="${h.totalProfit >= 0 ? 'positive' : 'negative'}">
                        ${(h.totalProfit * 100).toFixed(4)}
                    </span>
                </div>
            `).join('')}
        </div>

        <h2>Trade History</h2>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Entry Time</th>
                    <th>Exit Time</th>
                    <th>Entry Price</th>
                    <th>Exit Price</th>
                    <th>Stop Loss</th>
                    <th>Take Profit</th>
                    <th>Profit</th>
                    <th>Duration</th>
                    <th>Exit Reason</th>
                </tr>
            </thead>
            <tbody>
                ${this.strategy.performance.trades.map((trade, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${trade.type}</td>
                        <td>${new Date(trade.entry_time).toLocaleString()}</td>
                        <td>${new Date(trade.exit_time).toLocaleString()}</td>
                        <td>${trade.entry_price.toFixed(5)}</td>
                        <td>${trade.exit_price.toFixed(5)}</td>
                        <td>${trade.sl_price.toFixed(5)}</td>
                        <td>${trade.tp_price.toFixed(5)}</td>
                        <td class="${trade.profit >= 0 ? 'positive' : 'negative'}">
                            ${(trade.profit * 100).toFixed(4)}
                        </td>
                        <td>${trade.duration} bars</td>
                        <td>${trade.exit_reason}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="footer">
            <p>&copy; 2025 FxMath Quant | Strategy Converter</p>
            <p>Report generated on ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    generateInlineReport() {
        const basicStats = this.analytics.getBasicStats();
        const tradeStats = this.analytics.getTradeStats();
        const hourlyData = this.analytics.getHourlyPerformance();
        const { bestHours, worstHours } = this.analytics.getBestWorstHours();
        const equityCurve = this.analytics.getEquityCurve();

        // Generate charts
        const equityChart = new ChartRenderer('equityChart');
        const equityCanvas = equityChart.renderEquityCurve(equityCurve);

        const hourlyChart = new ChartRenderer('hourlyChart');
        const hourlyCanvas = hourlyChart.renderHourlyPerformance(hourlyData);

        const html = `
            <h2>Summary Statistics</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Trades</div>
                    <div class="stat-value">${basicStats.totalTrades}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Win Rate</div>
                    <div class="stat-value ${basicStats.winRate >= 50 ? 'positive' : 'negative'}">
                        ${basicStats.winRate.toFixed(2)}%
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Profit Factor</div>
                    <div class="stat-value ${basicStats.profitFactor >= 1 ? 'positive' : 'negative'}">
                        ${basicStats.profitFactor.toFixed(2)}
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Profit</div>
                    <div class="stat-value ${basicStats.totalProfit >= 0 ? 'positive' : 'negative'}">
                        ${(basicStats.totalProfit * 100).toFixed(2)}
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Largest Win</div>
                    <div class="stat-value positive">${(tradeStats.largestWin * 100).toFixed(4)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Largest Loss</div>
                    <div class="stat-value negative">${(tradeStats.largestLoss * 100).toFixed(4)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Average Win</div>
                    <div class="stat-value positive">${(tradeStats.averageWin * 100).toFixed(4)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Average Loss</div>
                    <div class="stat-value negative">${(tradeStats.averageLoss * 100).toFixed(4)}</div>
                </div>
            </div>

            <h2 style="margin-top: 2rem;">Equity Curve</h2>
            <div class="chart-container">
                ${equityCanvas.outerHTML}
            </div>

            <h2 style="margin-top: 2rem;">Hourly Performance</h2>
            <div class="chart-container">
                ${hourlyCanvas.outerHTML}
            </div>

            <h3>Best Performing Hours</h3>
            <div class="hours-list">
                ${bestHours.map(h => `
                    <div class="hour-item">
                        <strong>Hour ${h.hour}:00 Broker Time</strong><br>
                        Trades: ${h.trades}<br>
                        Wins: <span class="positive">${h.wins}</span> | 
                        Losses: <span class="negative">${h.losses}</span><br>
                        Profit: <span class="${h.totalProfit >= 0 ? 'positive' : 'negative'}">
                            ${(h.totalProfit * 100).toFixed(4)}
                        </span>
                    </div>
                `).join('')}
            </div>

            <h3>Worst Performing Hours</h3>
            <div class="hours-list">
                ${worstHours.map(h => `
                    <div class="hour-item">
                        <strong>Hour ${h.hour}:00 Broker Time</strong><br>
                        Trades: ${h.trades}<br>
                        Wins: <span class="positive">${h.wins}</span> | 
                        Losses: <span class="negative">${h.losses}</span><br>
                        Profit: <span class="${h.totalProfit >= 0 ? 'positive' : 'negative'}">
                            ${(h.totalProfit * 100).toFixed(4)}
                        </span>
                    </div>
                `).join('')}
            </div>

            <h2 style="margin-top: 2rem;">Trade History</h2>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Entry Time</th>
                        <th>Exit Time</th>
                        <th>Entry Price</th>
                        <th>Exit Price</th>
                        <th>Stop Loss</th>
                        <th>Take Profit</th>
                        <th>Profit</th>
                        <th>Duration</th>
                        <th>Exit Reason</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.strategy.performance.trades.map((trade, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${trade.type}</td>
                            <td>${new Date(trade.entry_time).toLocaleString()}</td>
                            <td>${new Date(trade.exit_time).toLocaleString()}</td>
                            <td>${trade.entry_price.toFixed(5)}</td>
                            <td>${trade.exit_price.toFixed(5)}</td>
                            <td>${trade.sl_price.toFixed(5)}</td>
                            <td>${trade.tp_price.toFixed(5)}</td>
                            <td class="${trade.profit >= 0 ? 'positive' : 'negative'}">
                                ${(trade.profit * 100).toFixed(4)}
                            </td>
                            <td>${trade.duration} bars</td>
                            <td>${trade.exit_reason}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        return html;
    }
}

window.ReportGenerator = ReportGenerator;
