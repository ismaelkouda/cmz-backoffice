import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { StorePathsService } from '@shared/services/store-paths.service';

@Injectable()
export class PagesGuard {
    constructor(
        private storePathsService: StorePathsService,
        private router: Router
    ) {}

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
