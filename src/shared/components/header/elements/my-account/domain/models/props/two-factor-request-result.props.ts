export interface TwoFactorRequestResultPops {
    readonly message: string;
    readonly maskedRecipient: string;
    readonly expiresInSeconds: number;
    readonly issuedAt: string;
}
