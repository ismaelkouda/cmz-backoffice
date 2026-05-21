import { Injectable } from '@angular/core';
import {
    HistoryChangeType,
    resolveChangeType,
} from '@shared/components/history/domain/enums/history-change-type.enum';
import { HistoryFieldChange } from '@shared/components/history/domain/interfaces/history-find-one-props.interface';
import { HistoryDataItemApiDto } from '@shared/components/history/infrastructure/api/dto/history-find-one-response-api.dto';

export interface ParsedEventData {
    before: Record<string, unknown> | null;
    after: Record<string, unknown> | null;
    parseError: boolean;
}
@Injectable({
    providedIn: 'root',
})
export class HistoryDataParserService {
    parseByEvent(
        event: string,
        data?: HistoryDataItemApiDto[]
    ): HistoryFieldChange[] {
        if (!data?.length) {
            return [];
        }

        const normalizedEvent = event
            ?.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();

        switch (normalizedEvent) {
            case 'creation':
                return this.parseCreate(data);

            case 'mise a jour':
                return this.parseUpdate(data);

            case 'suppression':
                return this.parseDelete(data);

            default:
                return this.parseGeneric(data);
        }
    }

    private parseCreate(data: HistoryDataItemApiDto[]): HistoryFieldChange[] {
        return data.map((item) => {
            const value = 'value' in item ? item.value : null;
            return {
                key: item.key,
                previousValue: null,
                currentValue: value,
                changeType: HistoryChangeType.ADDED,
            };
        });
    }

    private parseDelete(data: HistoryDataItemApiDto[]): HistoryFieldChange[] {
        return data.map((item) => {
            const value = 'value' in item ? item.value : null;
            return {
                key: item.key,
                previousValue: value,
                currentValue: null,
                changeType: HistoryChangeType.REMOVED,
            };
        });
    }

    private parseUpdate(data: HistoryDataItemApiDto[]): HistoryFieldChange[] {
        return data.map((item) => {
            console.log('item: ', item);
            const previousValue =
                'previousValue' in item ? item.previousValue : null;

            const currentValue =
                'currentValue' in item ? item.currentValue : null;

            return {
                key: item.key,
                previousValue,
                currentValue,
                changeType: resolveChangeType(previousValue, currentValue),
            };
        });
    }

    private parseGeneric(data: HistoryDataItemApiDto[]): HistoryFieldChange[] {
        return data.map((item) => ({
            key: item.key,
            previousValue: 'previousValue' in item ? item.previousValue : null,
            currentValue:
                'currentValue' in item
                    ? item.currentValue
                    : 'value' in item
                      ? item.value
                      : null,
            changeType: HistoryChangeType.UNCHANGED,
        }));
    }

    normalizeValue(value: unknown, locale = 'fr'): string {
        if (value === null || value === undefined) {
            return 'N/A';
        }

        if (Array.isArray(value)) {
            return value.map((v) => this.normalizeValue(v)).join(', ');
        }

        if (typeof value === 'object') {
            return JSON.stringify(value);
        }

        if (typeof value === 'boolean') {
            return value ? 'Oui' : 'Non';
        }

        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
            return new Intl.DateTimeFormat(locale, {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(new Date(value));
        }

        return String(value);
    }
}
