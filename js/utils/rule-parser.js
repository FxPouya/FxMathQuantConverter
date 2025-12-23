// Rule Parser - Converts JSON rules to platform-specific syntax
class RuleParser {
    constructor() {
        this.operators = {
            '<': { mql: '<', pine: '<', csharp: '<' },
            '>': { mql: '>', pine: '>', csharp: '>' },
            '<=': { mql: '<=', pine: '<=', csharp: '<=' },
            '>=': { mql: '>=', pine: '>=', csharp: '>=' },
            '==': { mql: '==', pine: '==', csharp: '==' },
            '!=': { mql: '!=', pine: '!=', csharp: '!=' }
        };

        this.priceTypes = {
            'OPEN': { mql: 'Open', pine: 'open', csharp: 'Open' },
            'HIGH': { mql: 'High', pine: 'high', csharp: 'High' },
            'LOW': { mql: 'Low', pine: 'low', csharp: 'Low' },
            'CLOSE': { mql: 'Close', pine: 'close', csharp: 'Close' }
        };
    }

    parseRule(rule, platform = 'mql') {
        // Handle complex expressions with parentheses and math operations
        // Example: "(OPEN[4] - LOW[8]) <= (CLOSE[8] - OPEN[3])"

        let parsedRule = rule;

        // Replace price references based on platform
        for (const [priceType, platformMap] of Object.entries(this.priceTypes)) {
            // Match patterns like OPEN[1], HIGH[2], etc.
            const regex = new RegExp(`${priceType}\\[(\\d+)\\]`, 'g');

            parsedRule = parsedRule.replace(regex, (match, offset) => {
                if (platform === 'mql') {
                    // MQ4 style - array indexing
                    return `${platformMap.mql}[${offset}]`;
                } else if (platform === 'mq5') {
                    // MQ5 style - use iOpen/iHigh/iLow/iClose functions
                    const funcName = `i${platformMap.mql}`;
                    return `${funcName}(_Symbol, PERIOD_CURRENT, ${offset})`;
                } else if (platform === 'pine') {
                    return offset === '0' ? platformMap.pine : `${platformMap.pine}[${offset}]`;
                } else if (platform === 'csharp') {
                    return `MarketSeries.${platformMap.csharp}.Last(${offset})`;
                }
            });
        }

        return parsedRule;
    }

    parseRules(rules, platform = 'mql') {
        return rules.map(rule => this.parseRule(rule, platform));
    }

    combineRules(parsedRules, platform = 'mql') {
        if (platform === 'mql' || platform === 'mq5' || platform === 'csharp') {
            return parsedRules.join(' && ');
        } else if (platform === 'pine') {
            return parsedRules.join(' and ');
        }
    }
}

// Export for use in other modules
window.RuleParser = RuleParser;
