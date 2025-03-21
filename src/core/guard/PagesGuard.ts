import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { StorePathsService } from '../../shared/services/store-paths.service';
import { Observable } from 'rxjs';

@Injectable()

export class PagesGuard implements CanActivate {
  constructor(private storePathsService: StorePathsService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const allowedPaths = this.storePathsService.getPaths; // Assume this returns a list of allowed paths

    // Check if the current path is allowed
    if (allowedPaths && allowedPaths.includes(state.url)) {
      console.log('allowedPaths', allowedPaths)
      return true; // Allow the navigation
    } else {
      // Redirect to a Not Found page or similar
      this.router.navigate(['/not-found']);
      return false; // Prevent navigation
    }
  }
}
