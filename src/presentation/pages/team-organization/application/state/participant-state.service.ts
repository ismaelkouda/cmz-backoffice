import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StateParticipantService {
    private filterParticipantState: string | null = null;
    private currentPageParticipantState: any = null;
    private itemSelectedState: object | null = null;

    setFilterParticipantState(state: Record<string, unknown>): string {
        return this.generateQueryStringFromObject(state);
    }

    getFilterParticipantState(state?: string): Record<string, string | null> {
        this.filterParticipantState = state ?? this.filterParticipantState;
        return this.parseQueryStringToObject(this.filterParticipantState ?? state ?? '');
    }

    setCurrentPageParticipantState(state: any): void {
        this.currentPageParticipantState = state;
    }

    getCurrentPageParticipantState(): any {
        return this.currentPageParticipantState;
    }

    setItemSelectedState(state: object): void {
        this.itemSelectedState = state;
    }

    getItemSelectedState(): object | null {
        return this.itemSelectedState;
    }

    clearParticipant(): void {
        this.filterParticipantState = null;
        this.currentPageParticipantState = null;
        this.itemSelectedState = null;
    }

    private generateQueryStringFromObject(dataFilter: Record<string, unknown> = {}): string {
        const params = new URLSearchParams();

        Object.entries(dataFilter ?? {}).forEach(([key, val]) => {
            if (key && val !== null && val !== undefined && String(val).trim() !== '') {
                params.append(encodeURIComponent(key), encodeURIComponent(String(val)));
            }
        });

        const queryString = params.toString();
        this.filterParticipantState = queryString;
        return queryString;
    }

    private parseQueryStringToObject(queryString: string): Record<string, string | null> {
        const filterObj: Record<string, string | null> = {};

        if (!queryString || typeof queryString !== 'string' || queryString.trim() === '') {
            return filterObj;
        }

        const params = new URLSearchParams(
            queryString.startsWith('?') ? queryString.substring(1) : queryString
        );

        params.forEach((value, key) => {
            filterObj[decodeURIComponent(key)] = value !== '' ? decodeURIComponent(value) : null;
        });

        return filterObj;
    }
}
