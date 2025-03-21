import { Injectable } from '@angular/core';
import { SmsBalance } from './table-sms-balance';

@Injectable()

export class StateSmsBalanceService{
    private filterSmsBalanceState: any;
    private currentPageSmsBalanceState: any;
    private itemSelectedState: SmsBalance|undefined;

    setFilterSmsBalanceState(state: any): string {
        return this.generateQueryStringFromObject(state)
    }
    
    getFilterSmsBalanceState(state?: any): Record<string, string | null>  {
        this.filterSmsBalanceState = state ?? this.filterSmsBalanceState;
        return this.parseQueryStringToObject(this.filterSmsBalanceState ?? state)
    }

    setCurrentPageSmsBalanceState(state: any): void {
        this.currentPageSmsBalanceState = state;
    }

    getCurrentPageSmsBalanceState(): any {
        return this.currentPageSmsBalanceState;
    }

    setItemSelectedState(state: SmsBalance|undefined): void {
        this.itemSelectedState = state;
    }

    getItemSelectedState(): SmsBalance|undefined {
        return this.itemSelectedState;
    }

    clearSmsBalance(): any {
        this.filterSmsBalanceState = null;
        this.currentPageSmsBalanceState = null;
        this.itemSelectedState = undefined;
    }

    public generateQueryStringFromObject = (dataFilter: Record<string, any> = {}): string => {
        const params = new URLSearchParams();
        if(dataFilter) {
            Object.entries(dataFilter).forEach(([key, val]) => {
                if (key && val !== null && val !== undefined) {
                    const encodedKey = encodeURIComponent(key);
                    const encodedVal = encodeURIComponent(val.toString());
                    params.append(encodedKey, encodedVal);
                }
            });
        }

        this.filterSmsBalanceState = params.toString();
        return params.toString();
    };

    private parseQueryStringToObject = (queryString: string): Record<string, string | null> => {
        const filterObj: Record<string, string | null> = {};

        if (!queryString || typeof queryString !== 'string' ||  queryString.trim() === '') {
            return filterObj;
        }

        const params = new URLSearchParams(queryString.startsWith('?') ? queryString.substring(1) : queryString);

        params.forEach((value, key) => {
            filterObj[decodeURIComponent(key)] = value !== '' ? decodeURIComponent(value) : null;
        });

        return filterObj;
    };

}