import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';

import { EndPointType } from '@shared/domain/types/end-point.types';
import {
    PROCESSING_ROUTE,
    REPORT_FINALIZATION_ROUTE,
    REQUESTS_ROUTE,
} from '@shared/routes/routes';

@Injectable()
export class RouteContextService {
    private readonly router = inject(Router);
    constructor() {
        console.log('🚀 RouteContextService initialisé');

        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                console.log('🎯 EndPointType détecté:', event);
            });
    }

    readonly currentEndPointType = toSignal(
        this.router.events.pipe(
            filter(
                (event): event is NavigationEnd =>
                    event instanceof NavigationEnd
            ),
            map((event: NavigationEnd) => this._extractEndPointType(event.url)),
            startWith(this._extractEndPointType(this.router.url))
        ),
        { initialValue: this._extractEndPointType(this.router.url) }
    );

    readonly isRequestsModule = computed(
        () => this.currentEndPointType() === REQUESTS_ROUTE
    );
    readonly isReportsProcessingModule = computed(
        () => this.currentEndPointType() === PROCESSING_ROUTE
    );
    readonly isReportsFinalizationModule = computed(
        () => this.currentEndPointType() === REPORT_FINALIZATION_ROUTE
    );

    private _extractEndPointType(url: string): EndPointType {
        const normalizedUrl = url.toLowerCase();
        console.log('normalizedUrl: ', normalizedUrl);

        const routeMappings = [
            {
                pattern: `/${REQUESTS_ROUTE}`,
                value: REQUESTS_ROUTE as EndPointType,
            },
            {
                pattern: `/${PROCESSING_ROUTE}`,
                value: PROCESSING_ROUTE as EndPointType,
            },
            {
                pattern: `/${REPORT_FINALIZATION_ROUTE}`,
                value: REPORT_FINALIZATION_ROUTE as EndPointType,
            },
        ];

        for (const mapping of routeMappings) {
            if (normalizedUrl.includes(mapping.pattern)) {
                return mapping.value;
            }
        }

        return REQUESTS_ROUTE;
    }
}
