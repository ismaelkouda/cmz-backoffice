import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { StoreTokenService } from '../../shared/services/store-token.service';

@Injectable()

export class AuthGuard implements CanActivate {
  constructor(private router: Router, private storeTokenService: StoreTokenService) { }

  canActivate(): boolean {
    const token = this.storeTokenService.getToken;

    if (token?.value) {
      return true;
    }
    this.router.navigateByUrl("auth/login")
    return false;
  }
}
