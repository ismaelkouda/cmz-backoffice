import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppStateService {
    private cache = new Map<string, any>();

    set(key: string, value: any) {
        this.cache.set(key, value);
        localStorage.setItem(key, JSON.stringify(value));
    }

    get<T>(key: string): T | null {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        const stored = localStorage.getItem(key);
        if (!stored) {
            return null;
        }

        const parsed = JSON.parse(stored);
        this.cache.set(key, parsed);
        return parsed;
    }

    clear(key: string) {
        this.cache.delete(key);
        localStorage.removeItem(key);
    }
}
