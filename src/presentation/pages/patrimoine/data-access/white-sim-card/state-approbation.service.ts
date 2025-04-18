import { Injectable } from '@angular/core';
import { DossierWhiteSimCard } from './table-white-sim-card';

@Injectable()
export class StateWhiteSimCardService {
    private filterWhiteSimCardState: any;
    private currentPageWhiteSimCardState: any;
    private itemSelectedState: DossierWhiteSimCard | undefined;

    setFilterWhiteSimCardState(state: any): string {
        return this.generateQueryStringFromObject(state);
    }

    getFilterWhiteSimCardState(state?: any): Record<string, string | null> {
        this.filterWhiteSimCardState = state ?? this.filterWhiteSimCardState;
        return this.parseQueryStringToObject(
            this.filterWhiteSimCardState ?? state
        );
    }

    setCurrentPageWhiteSimCardState(state: any): void {
        this.currentPageWhiteSimCardState = state;
    }

    getCurrentPageWhiteSimCardState(): any {
        return this.currentPageWhiteSimCardState;
    }

    setItemSelectedState(state: DossierWhiteSimCard | undefined): void {
        this.itemSelectedState = state;
    }

    getItemSelectedState(): DossierWhiteSimCard | undefined {
        return this.itemSelectedState;
    }

    clearWhiteSimCard(): any {
        this.filterWhiteSimCardState = null;
        this.currentPageWhiteSimCardState = null;
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

        this.filterWhiteSimCardState = params.toString();
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
