import { inject } from '@angular/core';
import { ResponsibilitiesSelectEntity } from '@pages/settings-security/domain/entities/users/responsibilities-select.entity';
import { ResponsibilitiesSelectRepository } from '@pages/settings-security/domain/repositories/users/responsibilities-select-repository';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export class ResponsibilitiesSelectUseCase {
    private readonly repository = inject(ResponsibilitiesSelectRepository);

    readAll(
        options?: FetchOptions
    ): Observable<ResponsibilitiesSelectEntity[]> {
        return this.repository.readAll(options);
    }
}
