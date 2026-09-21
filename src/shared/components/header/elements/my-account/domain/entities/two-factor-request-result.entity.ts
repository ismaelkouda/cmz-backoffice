import { TwoFactorRequestResultPops } from '../models/props/two-factor-request-result.props';

export class TwoFactorRequestResultEntity implements TwoFactorRequestResultPops {
    constructor(public readonly props: TwoFactorRequestResultPops) {}

    get channel(): 'email' | 'sms' {
        return this.props.channel;
    }

    get expiredAt(): string {
        return this.props.expiredAt;
    }

    get timeout(): number {
        return this.props.timeout;
    }
}
