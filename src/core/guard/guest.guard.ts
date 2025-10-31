import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DASHBOARD } from '../../shared/routes/routes';
import { EncodingDataService } from '../../shared/services/encoding-data.service';
import { TokenInterface } from '../../shared/interfaces/token.interface';

@Injectable()
export class GuestGuard {
    constructor(
        private router: Router,
        private encodingService: EncodingDataService
    ) {}

    canActivate(): boolean {
        const token = this.encodingService.getData(
            'token_data'
        ) as TokenInterface | null;

        if (token?.value) {
            this.router.navigateByUrl(DASHBOARD);
            return false;
        }
        return true;
    }
}
