import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ResponsibilitiesSelectEntity } from '@presentation/pages/settings-security/domain/entities/users/responsibilities-select.entity';
import { ResponsibilitiesSelectRepository } from '@presentation/pages/settings-security/domain/repositories/users/responsibilities-select-repository';

export class ResponsibilitiesSelectUseCase {
    private readonly repository = inject(ResponsibilitiesSelectRepository);

    readAll(): Observable<ResponsibilitiesSelectEntity[]> {
        return this.repository.readAll();
    }
}
