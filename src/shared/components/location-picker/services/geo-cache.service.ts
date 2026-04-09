import { Injectable, signal } from '@angular/core';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttlMs: number;
}

/**
 * Cache générique pour les données géographiques
 * Réflexion: Le cache est critique pour respecter le rate limiting de Nominatim (1 req/sec)
 * TTL par défaut: 1 heure (3600000 ms)
 */
@Injectable({ providedIn: 'root' })
export class GeoCacheService {
    private readonly cache = new Map<string, CacheEntry<any>>();
    private readonly defaultTtlMs = 60 * 60 * 1000; // 1 heure

    // Statistiques pour monitoring (optionnel)
    readonly stats = signal({
        hits: 0,
        misses: 0,
        size: 0,
    });

    /**
     * Récupère une valeur du cache
     * @param key
     * @returns T | null (null si absent ou expiré)
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            this.updateStats(false);
            return null;
        }

        const isExpired = Date.now() - entry.timestamp > entry.ttlMs;

        if (isExpired) {
            this.cache.delete(key);
            this.updateStats(false);
            return null;
        }

        this.updateStats(true);
        return entry.data as T;
    }

    /**
     * Stocke une valeur dans le cache
     * @param key
     * @param value
     * @param ttlMs - Durée de vie en ms (défaut: 1 heure)
     */
    set<T>(key: string, value: T, ttlMs?: number): void {
        this.cache.set(key, {
            data: value,
            timestamp: Date.now(),
            ttlMs: ttlMs ?? this.defaultTtlMs,
        });
        this.updateStats();
    }

    has(key: string): boolean {
        return this.cache.has(key) && !this.isExpired(key);
    }

    clear(): void {
        this.cache.clear();
        this.updateStats();
    }

    /**
     * Nettoie les entrées expirées
     */
    cleanExpired(): void {
        for (const [key, entry] of this.cache.entries()) {
            if (Date.now() - entry.timestamp > entry.ttlMs) {
                this.cache.delete(key);
            }
        }
        this.updateStats();
    }

    private isExpired(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) {
            return true;
        }
        return Date.now() - entry.timestamp > entry.ttlMs;
    }

    private updateStats(isHit?: boolean): void {
        const current = this.stats();
        this.stats.set({
            hits: current.hits + (isHit === true ? 1 : 0),
            misses: current.misses + (isHit === false ? 1 : 0),
            size: this.cache.size,
        });
    }
}
