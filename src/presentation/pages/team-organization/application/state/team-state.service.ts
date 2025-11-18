import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StateTeamService {
    private filterTeamState: string | null = null;
    private currentPageTeamState: any = null;
    private itemSelectedState: object | null = null;

    setFilterTeamState(state: Record<string, unknown>): string {
        return this.generateQueryStringFromObject(state);
    }

    getFilterTeamState(state?: string): Record<string, string | null> {
        this.filterTeamState = state ?? this.filterTeamState;
        return this.parseQueryStringToObject(this.filterTeamState ?? state ?? '');
    }

    setCurrentPageTeamState(state: any): void {
        this.currentPageTeamState = state;
    }

    getCurrentPageTeamState(): any {
        return this.currentPageTeamState;
    }

    setItemSelectedState(state: object): void {
        this.itemSelectedState = state;
    }

    getItemSelectedState(): object | null {
        return this.itemSelectedState;
    }

    clearTeam(): void {
        this.filterTeamState = null;
        this.currentPageTeamState = null;
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
        this.filterTeamState = queryString;
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
