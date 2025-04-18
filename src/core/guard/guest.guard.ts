import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DASHBOARD } from '../../shared/routes/routes';
import { StoreTokenService } from '../../shared/services/store-token.service';

@Injectable()
export class GuestGuard implements CanActivate {
    constructor(
        private router: Router,
        private storeTokenService: StoreTokenService
    ) {}

    canActivate(): boolean {
        const token = this.storeTokenService.getToken;

        if (token?.value) {
            this.router.navigateByUrl(DASHBOARD);
            return false;
        }
        return true;
    }
}
