// Rule Parser - Converts JSON rules to platform-specific syntax
class RuleParser {
    constructor() {
        this.operators = {
            '<': { mql: '<', pine: '<' },
            '>': { mql: '>', pine: '>' },
            '<=': { mql: '<=', pine: '<=' },
            '>=': { mql: '>=', pine: '>=' },
            '==': { mql: '==', pine: '==' },
            '!=': { mql: '!=', pine: '!=' }
        };

        this.priceTypes = {
            'OPEN': { mql: 'Open', pine: 'open' },
            'HIGH': { mql: 'High', pine: 'high' },
            'LOW': { mql: 'Low', pine: 'low' },
            'CLOSE': { mql: 'Close', pine: 'close' }
        };
    }

    parseRule(rule, platform = 'mql') {
        // Parse rule like "OPEN[1] < CLOSE[6]"
        const regex = /(\w+)\[(\d+)\]\s*([<>=!]+)\s*(\w+)\[(\d+)\]/;
        const match = rule.match(regex);

        if (!match) {
            console.error('Invalid rule format:', rule);
            return '';
        }

        const [, leftPrice, leftOffset, operator, rightPrice, rightOffset] = match;

        if (platform === 'mql') {
            return this.toMQL(leftPrice, leftOffset, operator, rightPrice, rightOffset);
        } else if (platform === 'pine') {
            return this.toPine(leftPrice, leftOffset, operator, rightPrice, rightOffset);
        }
    }

    toMQL(leftPrice, leftOffset, operator, rightPrice, rightOffset) {
        const left = `${this.priceTypes[leftPrice].mql}[${leftOffset}]`;
        const right = `${this.priceTypes[rightPrice].mql}[${rightOffset}]`;
        const op = this.operators[operator].mql;
        return `${left} ${op} ${right}`;
    }

    toPine(leftPrice, leftOffset, operator, rightPrice, rightOffset) {
        const left = leftOffset === '0'
            ? this.priceTypes[leftPrice].pine
            : `${this.priceTypes[leftPrice].pine}[${leftOffset}]`;
        const right = rightOffset === '0'
            ? this.priceTypes[rightPrice].pine
            : `${this.priceTypes[rightPrice].pine}[${rightOffset}]`;
        const op = this.operators[operator].pine;
        return `${left} ${op} ${right}`;
    }

    parseRules(rules, platform = 'mql') {
        return rules.map(rule => this.parseRule(rule, platform));
    }

    combineRules(parsedRules, platform = 'mql') {
        if (platform === 'mql' || platform === 'csharp') {
            return parsedRules.join(' && ');
        } else if (platform === 'pine') {
            return parsedRules.join(' and ');
        }
    }
}

// Export for use in other modules
window.RuleParser = RuleParser;
