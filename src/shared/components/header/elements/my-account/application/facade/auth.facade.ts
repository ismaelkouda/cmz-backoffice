import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '@shared/domain/services/session.service';

@Injectable({
    providedIn: 'root',
})
export class AuthFacade {
    private readonly sessionService = inject(SessionService);
    private readonly router = inject(Router);

    logout(): void {
        this.sessionService.clear();
        globalThis.location.href = '/auth/login';
    }
}
