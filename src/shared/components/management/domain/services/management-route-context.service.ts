import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';

import { EndPointType } from '@shared/domain/types/end-point.types';

@Injectable({ providedIn: 'root' })
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
        () => this.currentEndPointType() === 'requests'
    );
    readonly isReportsProcessingModule = computed(
        () => this.currentEndPointType() === 'processing'
    );
    readonly isReportsFinalizationModule = computed(
        () => this.currentEndPointType() === 'reports-finalization'
    );

    private _extractEndPointType(url: string): EndPointType {
        const normalizedUrl = url.toLowerCase();

        const routeMappings = [
            { pattern: '/requests', value: 'requests' as EndPointType },
            {
                pattern: '/processing',
                value: 'processing' as EndPointType,
            },
            {
                pattern: '/reports-finalization',
                value: 'reports-finalization' as EndPointType,
            },
        ];

        for (const mapping of routeMappings) {
            if (normalizedUrl.includes(mapping.pattern)) {
                return mapping.value;
            }
        }

        return 'requests';
    }

    debugCurrentRoute(): void {
        console.log('🐛 Debug Route:');
        console.log(' - URL actuelle:', this.router.url);
        console.log(' - EndPointType:', this.currentEndPointType());
        console.log(' - Is Requests:', this.isRequestsModule());
        console.log(
            ' - Is Reports Processing:',
            this.isReportsProcessingModule()
        );
    }
}
