import { TwoFactorRequestResultPops } from '../models/props/two-factor-request-result.props';

export class TwoFactorRequestResultEntity implements TwoFactorRequestResultPops {
    constructor(public readonly props: TwoFactorRequestResultPops) {}

    get message(): string {
        return this.props.message;
    }

    get maskedRecipient(): string {
        return this.props.maskedRecipient;
    }

    get expiresInSeconds(): number {
        return this.props.expiresInSeconds;
    }

    get issuedAt(): string {
        return this.props.issuedAt;
    }
}
