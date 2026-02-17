export function formatPhoneForMask(phone: string): string {
    return phone.replaceAll(/(\d{2})(?=\d)/g, '$1-');
}
