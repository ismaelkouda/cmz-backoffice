import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StateAgentService {
    private filterAgentState: string | null = null;
    private currentPageAgentState: any = null;
    private itemSelectedState: object | null = null;

    setFilterAgentState(state: Record<string, unknown>): string {
        return this.generateQueryStringFromObject(state);
    }

    getFilterAgentState(state?: string): Record<string, string | null> {
        this.filterAgentState = state ?? this.filterAgentState;
        return this.parseQueryStringToObject(this.filterAgentState ?? state ?? '');
    }

    // Legacy aliases kept for backward compatibility with existing components
    setFilterAgentIaState(state: Record<string, unknown>): string {
        return this.setFilterAgentState(state);
    }

    getFilterAgentIaState(state?: string): Record<string, string | null> {
        return this.getFilterAgentState(state);
    }

    setCurrentPageAgentState(state: any): void {
        this.currentPageAgentState = state;
    }

    getCurrentPageAgentState(): any {
        return this.currentPageAgentState;
    }

    setItemSelectedState(state: object): void {
        this.itemSelectedState = state;
    }

    getItemSelectedState(): object | null {
        return this.itemSelectedState;
    }

    clearAgent(): void {
        this.filterAgentState = null;
        this.currentPageAgentState = null;
        this.itemSelectedState = null;
    }

    clearAgentIa(): void {
        this.clearAgent();
    }

    private generateQueryStringFromObject(dataFilter: Record<string, unknown> = {}): string {
        const params = new URLSearchParams();

        Object.entries(dataFilter ?? {}).forEach(([key, val]) => {
            if (key && val !== null && val !== undefined && String(val).trim() !== '') {
                params.append(encodeURIComponent(key), encodeURIComponent(String(val)));
            }
        });

        const queryString = params.toString();
        this.filterAgentState = queryString;
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
