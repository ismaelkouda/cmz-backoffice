import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LogoutEntity } from '../entities/logout.entity';
import { MyAccountRepository } from '../repositories/my-account.repository';

@Injectable({
    providedIn: 'root',
})
export class MyAccountUseCase {
    private readonly myAccountRepository = inject(MyAccountRepository);

    executeFetchTake(): Observable<LogoutEntity> {
        return this.myAccountRepository.fetchLogout();
    }
}
