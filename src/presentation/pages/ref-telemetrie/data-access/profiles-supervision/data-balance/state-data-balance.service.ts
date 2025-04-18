import { Injectable } from '@angular/core';
import { DataBalance } from './table-data-balance';

@Injectable()
export class StateDataBalanceService {
    private filterDataBalanceState: any;
    private currentPageDataBalanceState: any;
    private itemSelectedState: DataBalance | undefined;

    setFilterDataBalanceState(state: any): string {
        return this.generateQueryStringFromObject(state);
    }

    getFilterDataBalanceState(state?: any): Record<string, string | null> {
        this.filterDataBalanceState = state ?? this.filterDataBalanceState;
        return this.parseQueryStringToObject(
            this.filterDataBalanceState ?? state
        );
    }

    setCurrentPageDataBalanceState(state: any): void {
        this.currentPageDataBalanceState = state;
    }

    getCurrentPageDataBalanceState(): any {
        return this.currentPageDataBalanceState;
    }

    setItemSelectedState(state: DataBalance | undefined): void {
        this.itemSelectedState = state;
    }

    getItemSelectedState(): DataBalance | undefined {
        return this.itemSelectedState;
    }

    clearDataBalance(): any {
        this.filterDataBalanceState = null;
        this.currentPageDataBalanceState = null;
        this.itemSelectedState = undefined;
    }

    public generateQueryStringFromObject = (
        dataFilter: Record<string, any> = {}
    ): string => {
        const params = new URLSearchParams();
        if (dataFilter) {
            Object.entries(dataFilter).forEach(([key, val]) => {
                if (key && val !== null && val !== undefined) {
                    const encodedKey = encodeURIComponent(key);
                    const encodedVal = encodeURIComponent(val.toString());
                    params.append(encodedKey, encodedVal);
                }
            });
        }

        this.filterDataBalanceState = params.toString();
        return params.toString();
    };

    private parseQueryStringToObject = (
        queryString: string
    ): Record<string, string | null> => {
        const filterObj: Record<string, string | null> = {};

        if (
            !queryString ||
            typeof queryString !== 'string' ||
            queryString.trim() === ''
        ) {
            return filterObj;
        }

        const params = new URLSearchParams(
            queryString.startsWith('?') ? queryString.substring(1) : queryString
        );

        params.forEach((value, key) => {
            filterObj[decodeURIComponent(key)] =
                value !== '' ? decodeURIComponent(value) : null;
        });

        return filterObj;
    };
}
