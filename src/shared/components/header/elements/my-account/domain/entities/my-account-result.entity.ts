export interface MyAccountResultEntity {
    readonly action:
        | 'change-password'
        | 'disable-2fa'
        | 'logout'
        | 'update-profile'
        | 'verify-2fa';
    readonly enabled2fa: boolean | null;
    readonly message: string;
    readonly processedAt: string;
    readonly success: boolean;
}
