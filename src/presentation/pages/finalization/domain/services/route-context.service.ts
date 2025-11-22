// route-context.service.ts (Version améliorée)
import { Injectable, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';

@Injectable()
export class RouteContextService {
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
        () => this.currentEndPointType() === 'reports-processing'
    );

    constructor(private router: Router) {
        console.log('🚀 RouteContextService initialisé');

        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event) => {
                console.log('📍 Nouvelle route:', (event as NavigationEnd).url);
                console.log(
                    '🎯 EndPointType détecté:',
                    this.currentEndPointType()
                );
            });
    }

    private _extractEndPointType(url: string): EndPointType {
        const normalizedUrl = url.toLowerCase();

        const routeMappings = [
            { pattern: '/requests', value: 'requests' as EndPointType },
            {
                pattern: '/reports-processing',
                value: 'reports-processing' as EndPointType,
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
