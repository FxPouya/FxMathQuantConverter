# Strategy Converter

Convert JSON trading strategies to MQ4, MQ5, and Pine Script Expert Advisors with comprehensive performance reporting.

![Strategy Converter](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

### 🚀 Multi-Platform Code Generation
- **MetaTrader 4 (MQ4)**: Complete Expert Advisor with ATR-based risk management
- **MetaTrader 5 (MQ5)**: Modern MQL5 code using CTrade class
- **Pine Script v5**: TradingView strategy with visual indicators

### 📊 Comprehensive Performance Reports
- **Summary Statistics**: Win rate, profit factor, drawdown, total profit
- **Trade Statistics**: Largest win/loss, average win/loss
- **Equity Curve**: Visual balance progression chart
- **Hourly Performance**: Win/loss distribution by hour of day
- **Best/Worst Hours**: Identify optimal trading times
- **Trade History**: Complete table of all trades with details

### 🎨 Modern UI/UX
- Premium dark theme with glassmorphism effects
- Drag & drop file upload
- Responsive design (desktop, tablet, mobile)
- Smooth animations and transitions
- Toast notifications
- Canvas-based chart rendering

## Quick Start

### 1. Open the Application
```bash
# Simply open index.html in your browser
open index.html
```

### 2. Load a Strategy
- Drag and drop a JSON strategy file onto the drop zone
- Or click the drop zone to browse and select a file

### 3. Generate Code
Click any of the generation buttons:
- **Generate MQ4** - Download MetaTrader 4 EA
- **Generate MQ5** - Download MetaTrader 5 EA
- **Generate Pine Script** - Download TradingView strategy

### 4. View Performance Report
- Click **Generate Report** to see comprehensive analysis
- Click **Download Report** to save HTML report

## Strategy JSON Format

```json
{
  "buy_rules": [
    "OPEN[1] < CLOSE[6]",
    "HIGH[9] >= CLOSE[3]",
    "LOW[10] >= LOW[1]"
  ],
  "sell_rules": [
    "OPEN[1] > CLOSE[6]",
    "HIGH[9] <= CLOSE[3]",
    "LOW[10] <= LOW[1]"
  ],
  "parameters": {
    "symbol": "EURUSD",
    "atr_period": 30,
    "sl_multiplier": 4.79,
    "tp_multiplier": 8.10
  },
  "performance": {
    "total_trades": 408,
    "buy_trades": 212,
    "sell_trades": 196,
    "winning_trades": 269,
    "losing_trades": 139,
    "win_rate": 65.93,
    "profit_factor": 1.53,
    "max_drawdown": 0.000049,
    "final_balance": 10000.028,
    "total_profit": 0.0282,
    "gross_profit": 0.0817,
    "gross_loss": 0.0535,
    "trades": [
      {
        "entry_bar": 32,
        "exit_bar": 38,
        "entry_time": "2025-12-15T23:06:00",
        "exit_time": "2025-12-15T23:12:00",
        "type": "BUY",
        "entry_price": 1.33707,
        "exit_price": 1.33750,
        "sl_price": 1.33645,
        "tp_price": 1.33811,
        "profit": 0.00043,
        "duration": 6,
        "exit_reason": "OPPOSITE"
      }
      // ... more trades
    ]
  }
}
```

## File Structure

```
EA-Convertor/
├── index.html                      # Main application
├── css/
│   └── style.css                   # Styling
├── js/
│   ├── main.js                     # App logic
│   ├── analytics.js                # Performance calculations
│   ├── chart-renderer.js           # Chart visualization
│   ├── report-generator.js         # Report generation
│   ├── converters/
│   │   ├── mq4-converter.js       # MQL4 generator
│   │   ├── mq5-converter.js       # MQL5 generator
│   │   └── pine-converter.js      # Pine Script generator
│   └── utils/
│       ├── rule-parser.js         # Rule syntax parser
│       └── download.js            # Download helper
└── strategies/
    └── *.json                      # Sample strategies
```

## How It Works

### Rule Parsing
The application parses trading rules and converts them to platform-specific syntax:

**Input**: `"OPEN[1] < CLOSE[6]"`

**MQL Output**: `Open[1] < Close[6]`

**Pine Output**: `open[1] < close[6]`

### ATR-Based Risk Management
All generated EAs use ATR for dynamic stop loss and take profit:

```
SL = Entry Price ± (ATR × SL_Multiplier)
TP = Entry Price ± (ATR × TP_Multiplier)
```

### Performance Analytics
- Calculates win rate, profit factor, drawdown
- Analyzes performance by hour of day
- Generates equity curve from trade history
- Identifies best and worst trading hours

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Technologies Used

- **HTML5**: Semantic markup, Canvas API
- **CSS3**: Custom properties, Grid, Flexbox, Animations
- **JavaScript ES6+**: Classes, Modules, Async/Await
- **No external dependencies**: Pure vanilla JavaScript

## Sample Strategies Included

- `GU_M1.json` - GBPUSD M1 strategy
- `EU_M1.json` - EURUSD M1 strategy
- `XU_M1.json` - XAUUSD M1 strategy
- `UJ_M1.json` - USDJPY M1 strategy
- And more...

## Generated Code Features

### MQ4 (MetaTrader 4)
- Complete EA structure
- Input parameters
- ATR calculation
- Buy/sell signal functions
- Order management
- Error handling

### MQ5 (MetaTrader 5)
- Modern MQL5 syntax
- CTrade class integration
- Indicator handles
- Position management
- Type filling options

### Pine Script v5
- Strategy declaration
- Input parameters
- ATR calculation
- Entry/exit logic
- Visual buy/sell signals
- SL/TP plots

## Performance Report Includes

1. **Summary Statistics**
   - Total trades
   - Win rate %
   - Profit factor
   - Total profit
   - Max drawdown
   - Final balance

2. **Trade Statistics**
   - Largest win
   - Largest loss
   - Average win
   - Average loss

3. **Equity Curve Chart**
   - Balance progression over time
   - Visual performance tracking

4. **Hourly Performance Chart**
   - Wins/losses by hour (UTC)
   - Bar chart visualization

5. **Best/Worst Hours**
   - Top 3 profitable hours
   - Top 3 unprofitable hours
   - Trade counts and profits

6. **Complete Trade History**
   - Entry/exit times
   - Prices and profits
   - Duration and exit reason

## License

MIT License - Feel free to use and modify

## Author

**FxMath Quant**
- Website: https://fxmath.com
- Email: support@fxmath.com

## Support

For issues or questions:
1. Check the walkthrough documentation
2. Review sample strategies
3. Contact support@fxmath.com

---

**Made with ❤️ by FxMath Quant**
