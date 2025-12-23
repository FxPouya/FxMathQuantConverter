// Analytics Module - Calculate performance metrics
class Analytics {
    constructor(strategy) {
        this.strategy = strategy;
        this.performance = strategy.performance;
        this.trades = strategy.performance.trades || [];
    }

    getBasicStats() {
        const perf = this.performance;
        return {
            totalTrades: perf.total_trades || 0,
            buyTrades: perf.buy_trades || 0,
            sellTrades: perf.sell_trades || 0,
            winningTrades: perf.winning_trades || 0,
            losingTrades: perf.losing_trades || 0,
            winRate: perf.win_rate || 0,
            profitFactor: perf.profit_factor || 0,
            maxDrawdown: perf.max_drawdown || 0,
            totalProfit: perf.total_profit || 0,
            grossProfit: perf.gross_profit || 0,
            grossLoss: perf.gross_loss || 0,
            finalBalance: perf.final_balance || 10000
        };
    }

    getTradeStats() {
        if (this.trades.length === 0) {
            return {
                largestWin: 0,
                largestLoss: 0,
                averageWin: 0,
                averageLoss: 0
            };
        }

        const profits = this.trades.map(t => t.profit);
        const wins = profits.filter(p => p > 0);
        const losses = profits.filter(p => p < 0);

        return {
            largestWin: wins.length > 0 ? Math.max(...wins) : 0,
            largestLoss: losses.length > 0 ? Math.min(...losses) : 0,
            averageWin: wins.length > 0 ? wins.reduce((a, b) => a + b, 0) / wins.length : 0,
            averageLoss: losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / losses.length : 0
        };
    }

    getHourlyPerformance() {
        const hourlyData = Array(24).fill(null).map(() => ({
            hour: 0,
            wins: 0,
            losses: 0,
            totalProfit: 0,
            trades: 0
        }));

        this.trades.forEach(trade => {
            const entryTime = new Date(trade.entry_time);
            const hour = entryTime.getUTCHours();

            hourlyData[hour].hour = hour;
            hourlyData[hour].trades++;
            hourlyData[hour].totalProfit += trade.profit;

            if (trade.profit > 0) {
                hourlyData[hour].wins++;
            } else {
                hourlyData[hour].losses++;
            }
        });

        return hourlyData;
    }

    getBestWorstHours() {
        const hourlyData = this.getHourlyPerformance();

        // Filter hours with trades
        const activeHours = hourlyData.filter(h => h.trades > 0);

        if (activeHours.length === 0) {
            return { bestHours: [], worstHours: [] };
        }

        // Sort by profit
        const sortedByProfit = [...activeHours].sort((a, b) => b.totalProfit - a.totalProfit);

        return {
            bestHours: sortedByProfit.slice(0, 3),
            worstHours: sortedByProfit.slice(-3).reverse()
        };
    }

    getEquityCurve() {
        let balance = 10000;
        const equity = [{ trade: 0, balance: balance }];

        this.trades.forEach((trade, index) => {
            balance += trade.profit;
            equity.push({
                trade: index + 1,
                balance: balance,
                time: trade.exit_time
            });
        });

        return equity;
    }

    getMonthlyBreakdown() {
        const monthly = {};

        this.trades.forEach(trade => {
            const date = new Date(trade.entry_time);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthly[monthKey]) {
                monthly[monthKey] = {
                    trades: 0,
                    profit: 0,
                    wins: 0,
                    losses: 0
                };
            }

            monthly[monthKey].trades++;
            monthly[monthKey].profit += trade.profit;
            if (trade.profit > 0) {
                monthly[monthKey].wins++;
            } else {
                monthly[monthKey].losses++;
            }
        });

        return monthly;
    }
}

window.Analytics = Analytics;
