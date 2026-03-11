import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenInterface } from '@shared/domain/interfaces/token.interface';
import { EncodingDataService } from '@shared/domain/services/encoding-data.service';

export const authGuard: CanActivateFn = (route, state) => {
    console.log('AuthGuard invoked for route:', state.url);
    console.log('Route parameters:', route.params);
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
