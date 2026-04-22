import { Injectable } from '@angular/core';
import { ParsedEventData } from '@shared/domain/services/history-data-parser';

@Injectable({ providedIn: 'root' })
export class HistoryDataParserService {
    /**
     * Parse les données d'historique
     * Les données peuvent être:
     * - Un tableau [{ key, value }] (format API)
     * - Un JSON string (ancien format)
     * - Une chaîne vide ou null
     * @param data
     */
    parse(
        data?: { key: string; value: string }[] | string | null
    ): ParsedEventData {
        if (!data) {
            return { before: null, after: null, parseError: false };
        }

        // Format tableau [{ key, value }]
        if (Array.isArray(data)) {
            return this.parseFromArray(data);
        }

        // Format JSON string
        if (typeof data === 'string') {
            return this.parseFromString(data);
        }

        return { before: null, after: null, parseError: false };
    }

    private parseFromArray(
        data: { key: string; value: string }[]
    ): ParsedEventData {
        let before: Record<string, unknown> | null = null;
        let after: Record<string, unknown> | null = null;

        for (const item of data) {
            try {
                const parsedValue = JSON.parse(item.value);

                if (item.key === 'before') {
                    before = parsedValue;
                } else if (item.key === 'after') {
                    after = parsedValue;
                }
            } catch {
                // Si la valeur n'est pas du JSON, la prendre telle quelle
                if (item.key === 'before') {
                    before = { value: item.value };
                } else if (item.key === 'after') {
                    after = { value: item.value };
                }
            }
        }

        return { before, after, parseError: false };
    }

    private parseFromString(data: string): ParsedEventData {
        try {
            const parsed = JSON.parse(data);
            return {
                before: parsed?.before ?? null,
                after: parsed?.after ?? null,
                parseError: false,
            };
        } catch (error) {
            console.error('Failed to parse history data:', error);
            return { before: null, after: null, parseError: true };
        }
    }

    /**
     * Normalise une valeur pour l'affichage
     * Retourne une chaîne de caractères formatée
     * @param value
     * @param locale
     */
    normalizeValue(value: unknown, locale = 'fr'): string {
        if (value === null || value === undefined) {
            return 'N/A';
        }

        // Handle objects
        if (typeof value === 'object' && !Array.isArray(value)) {
            const obj = value as Record<string, unknown>;
            // Extraction intelligente du nom
            if (obj['nom']) {
                return String(obj['nom']);
            }
            if (obj['name']) {
                return String(obj['name']);
            }
            if (obj['libelle']) {
                return String(obj['libelle']);
            }
            if (obj['id']) {
                return `ID: ${obj['id']}`;
            }
            return JSON.stringify(obj);
        }

        // Handle arrays
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return 'Vide';
            }
            return value
                .map((item) => this.normalizeValue(item, locale))
                .join(', ');
        }

        // Handle dates
        if (typeof value === 'string' && this.isDateString(value)) {
            return this.formatDate(value, locale);
        }

        // Handle boolean
        if (typeof value === 'boolean') {
            return value ? 'Oui' : 'Non';
        }

        // Handle numbers
        if (typeof value === 'number') {
            return value.toLocaleString(locale);
        }

        return String(value);
    }

    private isDateString(value: string): boolean {
        const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;
        return dateRegex.test(value);
    }

    private formatDate(value: string, locale: string): string {
        try {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                return value;
            }
            return new Intl.DateTimeFormat(locale, {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(date);
        } catch {
            return value;
        }
    }
}
