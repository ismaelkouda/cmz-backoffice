import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import {
    HOME_ROUTE,
    NEWS_ROUTE,
    SLIDE_ROUTE,
} from '@presentation/pages/content-management/content-management.routes';
import { RouteContextType } from '@shared/domain/types/route-context.types';
import {
    PROCESSING_ROUTE,
    FINALIZATION_ROUTE,
    REQUESTS_ROUTE,
} from '@shared/routes/routes';
import { filter, map, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RouteContextService {
    private readonly router = inject(Router);

    readonly currentRouteContext = toSignal(
        this.router.events.pipe(
            filter(
                (event): event is NavigationEnd =>
                    event instanceof NavigationEnd
            ),
            map((event: NavigationEnd) => this._extractRouteContext(event.url)),
            startWith(this._extractRouteContext(this.router.url))
        ),
        { initialValue: this._extractRouteContext(this.router.url) }
    );

    readonly isRequestsModule = computed(
        () => this.currentRouteContext() === REQUESTS_ROUTE
    );
    readonly isReportsProcessingModule = computed(
        () => this.currentRouteContext() === PROCESSING_ROUTE
    );
    readonly isReportsFinalizationModule = computed(
        () => this.currentRouteContext() === FINALIZATION_ROUTE
    );

    private _extractRouteContext(url: string): RouteContextType {
        const normalizedUrl = url.toLowerCase();

        if (normalizedUrl.includes(`/${REQUESTS_ROUTE}`)) {
            return REQUESTS_ROUTE;
        }

        if (normalizedUrl.includes(`/${PROCESSING_ROUTE}`)) {
            return PROCESSING_ROUTE;
        }

        if (normalizedUrl.includes(`/${FINALIZATION_ROUTE}`)) {
            return FINALIZATION_ROUTE;
        }

        if (normalizedUrl.includes(`/${HOME_ROUTE}`)) {
            return HOME_ROUTE;
        }

        if (normalizedUrl.includes(`/${NEWS_ROUTE}`)) {
            return NEWS_ROUTE;
        }

        if (normalizedUrl.includes(`/${SLIDE_ROUTE}`)) {
            return SLIDE_ROUTE;
        }

        return REQUESTS_ROUTE;
    }
}
