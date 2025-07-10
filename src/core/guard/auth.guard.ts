import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { EncodingDataService } from '../../shared/services/encoding-data.service';
import { TokenInterface } from '../../shared/interfaces/token.interface';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private encodingService: EncodingDataService
    ) {}

    canActivate(): boolean {
        const token = this.encodingService.getData(
            'token_data'
        ) as TokenInterface | null;

        if (token?.value) {
            return true;
        }
        this.router.navigateByUrl('auth/login');
        return false;
    }
}
