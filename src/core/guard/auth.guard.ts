import { EncodingDataService } from './../../shared/services/encoding-data.service';
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable()

export class AuthGuard implements CanActivate {
  constructor(private encodingDataService: EncodingDataService, private router: Router) {}

  canActivate(): boolean {
    let token: Object
    const user: any = this.encodingDataService.getData("user");
    user ? (token = JSON.parse(this.encodingDataService.getData("user"))?.token) : (token = null);
    if(token) {
        return true;
    }
    this.router.navigateByUrl("auth/login")
    return false;
  }
}


// import { exhaustMap, map } from 'rxjs/operators';
// import { AppState } from './../store/app.state';
// import { Store } from '@ngrx/store';
// import { Observable } from 'rxjs';
// import { Injectable } from '@angular/core';
// import {
//   ActivatedRouteSnapshot,
//   CanActivate,
//   Router,
//   RouterStateSnapshot,
//   UrlTree,
// } from '@angular/router';
// import { isAuthenticated } from '../../presentation/pages/authentication/state/auth.selector';

// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {
//   constructor(private store: Store<AppState>, private router: Router) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ):
//     | boolean
//     | UrlTree
//     | Observable<boolean | UrlTree>
//     | Promise<boolean | UrlTree> {
//     return this.store.select(isAuthenticated).pipe(
//       map((authenticate) => {
//         if (!authenticate) {
//           return this.router.createUrlTree(['auth/login']);
//         }
//         return true;
//       })
//     );
//   }
// }