import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenInterface } from '../../shared/interfaces/token.interface';
import { DASHBOARD } from '../../shared/routes/routes';
import { EncodingDataService } from '../../shared/services/encoding-data.service';

export const unauthGuard: CanActivateFn = () => {
    const encodingService = inject(EncodingDataService)
    const token = encodingService.getData('token_data') as TokenInterface | null;
    const router = inject(Router)

    if(!token || !token?.value) {
        return true;
    } else {
        router.navigate([DASHBOARD]);
        return false;
    }
};