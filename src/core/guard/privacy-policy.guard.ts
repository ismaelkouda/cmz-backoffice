import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenInterface } from '@shared/domain/interfaces/token.interface';
import { EncodingDataService } from '@shared/domain/services/encoding-data.service';

export const privacyPolicyGuard: CanActivateFn = () => {
    const encodingService = inject(EncodingDataService);
    const token = encodingService.getData(
        'token_data'
    ) as TokenInterface | null;
    const router = inject(Router);

    if (!token?.value) {
        return router.createUrlTree(['auth', 'login']);
    }

    return true;
};
