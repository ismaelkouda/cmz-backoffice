import { Injectable } from '@angular/core';

@Injectable()

export class EndpointParamsService {

    public buildFilteredUrl(dataFilter: Record<string, any>[]): string {
        const queryParams = new URLSearchParams();
        dataFilter.forEach((filter) => {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });
        });
        return `${queryParams.toString()}`;
    }
}