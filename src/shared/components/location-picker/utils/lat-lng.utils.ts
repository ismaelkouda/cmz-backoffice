import { inject, PLATFORM_ID } from '@angular/core';

export const DEFAULT_CENTER_IVORY_COAST: { lat: number; lng: number } = {
    lat: 5.3167,
    lng: -4.0333,
};

export function isMobile(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    return window.innerWidth <= 992;
}

export function getPlatformId() {
    return inject(PLATFORM_ID);
}
