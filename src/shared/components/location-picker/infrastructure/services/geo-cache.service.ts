import { Injectable } from '@angular/core';

interface CacheEntry<T> {
    value: T;
    timestamp: number;
    ttlMs?: number;
}

@Injectable({ providedIn: 'root' })
export class GeoCacheService {
    private readonly cache = new Map<string, CacheEntry<any>>();
    private readonly defaultTtlMs = 60 * 60 * 1000;

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry || Date.now() > entry.timestamp) {
            this.cache.delete(key);
            return null;
        }

        return entry.value;
    }

    set<T>(key: string, value: T): void {
        this.cache.set(key, {
            value,
            timestamp: Date.now() + this.defaultTtlMs,
        });
    }

    buildKey(data: unknown): string {
        return JSON.stringify(data);
    }
}
