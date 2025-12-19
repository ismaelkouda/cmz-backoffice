import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { BreadcrumbItem } from "./breadcrumb.model";

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    private readonly _currentUrl = signal(this.router.url);

    private readonly navigationEnd = toSignal(
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ),
        { initialValue: null }
    );

    readonly breadcrumbs = computed(() => {
        this.navigationEnd();
        return this.buildBreadcrumbs(this.route.root, '', []);
    });

    constructor() {
        effect(() => {
            this._currentUrl.set(this.router.url);
        });
    }

    private buildBreadcrumbs(
        route: ActivatedRoute,
        url: string,
        breadcrumbs: BreadcrumbItem[]
    ): BreadcrumbItem[] {
        const children = route.children;
        if (!children.length) return breadcrumbs;

        for (const child of children) {
            const segment = child.snapshot.url
                .map(s => s.path)
                .join('/');

            const nextUrl = segment ? `${url}/${segment}` : url;

            const crumb = child.snapshot.data['breadcrumb'];

            if (crumb?.hide !== true && crumb?.label) {
                const label =
                    typeof crumb.label === 'function'
                        ? crumb.label(child.snapshot)
                        : crumb.label;

                // 🛡️ anti-duplication
                if (!breadcrumbs.some(b => b.label === label)) {
                    breadcrumbs.push({
                        label,
                        icon: crumb.icon,
                        url: nextUrl,
                    });
                }
            }

            return this.buildBreadcrumbs(child, nextUrl, breadcrumbs);
        }

        return breadcrumbs;
    }
}
