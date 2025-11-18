import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenInterface } from '@shared/interfaces/token.interface';
import { EncodingDataService } from '@shared/services/encoding-data.service';

export const authGuard: CanActivateFn = (route, state) => {
    const encodingService = inject(EncodingDataService);
    const token = encodingService.getData(
        'token_data'
    ) as TokenInterface | null;
    const router = inject(Router);

    if (token?.value) {
        return true;
    } else {
        router.navigateByUrl('auth/login');
        return false;
    }
};
