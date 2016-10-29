/**
 * Encapsulates the Exchange data model.
 *
 * @author gazbert
 */
export class Exchange {
    constructor(public id: string,
                public label: string,
                public adapter: string,
                public networkConfig: NetworkConfig,
                public markets: Market[],
                public emailAlertsConfig: EmailAlertsConfig) {
    }

    clone() {
        return new Exchange(this.id, this.label, this.adapter, this.networkConfig, this.markets, this.emailAlertsConfig);
    }
}

export class NetworkConfig {
    constructor(public connectionTimeout: number,
                public nonFatalErrorHttpStatusCodes: ErrorCode[],
                public nonFatalErrorMessages: ErrorMessage[]) {
    }
}

export class ErrorCode {
    constructor(public value: number) {
    }
}

export class ErrorMessage {
    constructor(public value: string) {
    }
}

export class Market {
    constructor(public id: string,
                public label: string,
                public enabled: boolean,
                public baseCurrency: string,
                public counterCurrency: string,
                public tradingStrategy: TradingStrategy) {
    }
}

export class TradingStrategy {
    constructor(public id: string,
                public label: string,
                public description: string,
                public className: string) {
    }
}

export class EmailAlertsConfig {
    constructor(public enabled: boolean,
                public smtpHost: string,
                public smtpPort: number,
                public accountUsername: string,
                public accountPassword: string,
                public toAddress: string,
                public fromAddress: string) {
    }
}