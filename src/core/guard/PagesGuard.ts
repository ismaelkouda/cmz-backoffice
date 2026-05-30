import { Injectable, inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { StorePathsService } from '@shared/domain/services/store-paths.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PagesGuard {
    private storePathsService = inject(StorePathsService);
    private router = inject(Router);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const allowedPaths = this.storePathsService.getPaths;

        if (allowedPaths && allowedPaths.includes(state.url)) {
            return true;
        } else {
            this.router.navigate(['/not-found']);
            return false;
        }
    }
}
