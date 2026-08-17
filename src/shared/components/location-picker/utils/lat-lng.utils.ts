import { inject, PLATFORM_ID } from '@angular/core';

export const DEFAULT_CENTER_IVORY_COAST: {
    latitude: number;
    longitude: number;
} = {
    latitude: 5.3167,
    longitude: -4.0333,
};

export function isMobile(): boolean {
    if (typeof globalThis.window === 'undefined') {
        return false;
    }
    return window.innerWidth <= 992;
}

export function getPlatformId() {
    return inject(PLATFORM_ID);
}
