// Main Application Logic
class StrategyConverter {
    constructor() {
        this.strategy = null;
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        this.strategyInfo = document.getElementById('strategyInfo');
        this.reportSection = document.getElementById('reportSection');
        this.reportContent = document.getElementById('reportContent');

        // Info elements
        this.infoSymbol = document.getElementById('infoSymbol');
        this.infoTrades = document.getElementById('infoTrades');
        this.infoWinRate = document.getElementById('infoWinRate');
        this.infoProfitFactor = document.getElementById('infoProfitFactor');
        this.infoATR = document.getElementById('infoATR');
        this.infoSL = document.getElementById('infoSL');
        this.infoTP = document.getElementById('infoTP');
        this.infoProfit = document.getElementById('infoProfit');

        // Buttons
        this.btnMQ4 = document.getElementById('btnMQ4');
        this.btnMQ5 = document.getElementById('btnMQ5');
        this.btnPine = document.getElementById('btnPine');
        this.btnCTrader = document.getElementById('btnCTrader');
        this.btnReport = document.getElementById('btnReport');
        this.btnDownloadReport = document.getElementById('btnDownloadReport');
    }

    attachEventListeners() {
        // Drop zone events
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));

        // File input
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Conversion buttons
        this.btnMQ4.addEventListener('click', () => this.generateMQ4());
        this.btnMQ5.addEventListener('click', () => this.generateMQ5());
        this.btnPine.addEventListener('click', () => this.generatePineScript());
        this.btnCTrader.addEventListener('click', () => this.generateCTrader());
        this.btnReport.addEventListener('click', () => this.generateReport());
        this.btnDownloadReport.addEventListener('click', () => this.downloadReport());
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.loadFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.loadFile(files[0]);
        }
    }

    loadFile(file) {
        if (!file.name.endsWith('.json')) {
            alert('Please select a JSON file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.strategy = JSON.parse(e.target.result);
                this.displayStrategyInfo();
                this.showStrategySection();
            } catch (error) {
                alert('Error parsing JSON file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    displayStrategyInfo() {
        const { parameters, performance } = this.strategy;

        this.infoSymbol.textContent = parameters.symbol || 'N/A';
        this.infoTrades.textContent = performance.total_trades || 0;
        this.infoWinRate.textContent = (performance.win_rate || 0).toFixed(2) + '%';
        this.infoProfitFactor.textContent = (performance.profit_factor || 0).toFixed(2);
        this.infoATR.textContent = parameters.atr_period || 'N/A';
        this.infoSL.textContent = (parameters.sl_multiplier || 0).toFixed(2);
        this.infoTP.textContent = (parameters.tp_multiplier || 0).toFixed(2);
        this.infoProfit.textContent = ((performance.total_profit || 0) * 100).toFixed(2) + '%';
    }

    showStrategySection() {
        this.strategyInfo.classList.remove('hidden');
        this.dropZone.style.display = 'none';
    }

    generateMQ4() {
        if (!this.strategy) return;

        const converter = new MQ4Converter(this.strategy);
        const code = converter.generate();
        const filename = `Strategy_${this.strategy.parameters.symbol}_${Date.now()}.mq4`;

        DownloadHelper.downloadText(filename, code);
        this.showNotification('MQ4 file generated successfully!');
    }

    generateMQ5() {
        if (!this.strategy) return;

        const converter = new MQ5Converter(this.strategy);
        const code = converter.generate();
        const filename = `Strategy_${this.strategy.parameters.symbol}_${Date.now()}.mq5`;

        DownloadHelper.downloadText(filename, code);
        this.showNotification('MQ5 file generated successfully!');
    }

    generatePineScript() {
        if (!this.strategy) return;

        const converter = new PineConverter(this.strategy);
        const code = converter.generate();
        const filename = `Strategy_${this.strategy.parameters.symbol}_${Date.now()}.pine`;

        DownloadHelper.downloadText(filename, code);
        this.showNotification('Pine Script file generated successfully!');
    }

    generateCTrader() {
        if (!this.strategy) return;

        const converter = new CTraderConverter(this.strategy);
        const code = converter.generate();
        const filename = `Strategy_${this.strategy.parameters.symbol}_${Date.now()}.cs`;

        DownloadHelper.downloadText(filename, code);
        this.showNotification('cTrader cBot generated successfully!');
    }

    generateReport() {
        if (!this.strategy) return;

        const reportGen = new ReportGenerator(this.strategy);
        const reportHTML = reportGen.generateInlineReport();

        this.reportContent.innerHTML = reportHTML;
        this.reportSection.classList.remove('hidden');

        // Scroll to report
        this.reportSection.scrollIntoView({ behavior: 'smooth' });
        this.showNotification('Report generated successfully!');
    }

    downloadReport() {
        if (!this.strategy) return;

        const reportGen = new ReportGenerator(this.strategy);
        const reportHTML = reportGen.generateHTML();
        const filename = `Report_${this.strategy.parameters.symbol}_${Date.now()}.html`;

        DownloadHelper.downloadHTML(filename, reportHTML);
        this.showNotification('Report downloaded successfully!');
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00e5ff 0%, #7c4dff 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
    }
    .stat-card {
        background: rgba(30, 35, 60, 0.6);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .stat-label {
        color: #9fa8da;
        font-size: 0.85rem;
        margin-bottom: 0.5rem;
    }
    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #00e5ff;
    }
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
`;
document.head.appendChild(style);

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.strategyConverterApp = new StrategyConverter();
});
