export function normalizePhoneNumber(phone?: string): string | undefined {
    if (!phone) {
        return undefined;
    }

    return phone.replaceAll(/\D/g, '');
}
