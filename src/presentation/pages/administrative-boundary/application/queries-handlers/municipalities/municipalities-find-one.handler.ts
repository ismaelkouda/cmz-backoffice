import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MunicipalitiesFindOneQuery } from '@presentation/pages/administrative-boundary/application/queries/municipalities/municipalities-find-one.query';
import { MunicipalitiesFindOneUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/municipalities/municipalities-find-one.use-case';
import { MunicipalitiesFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one.entity';

@Injectable({ providedIn: 'root' })
export class MunicipalitiesFindOneHandler {
    private readonly useCase = inject(MunicipalitiesFindOneUseCase);

    execute(
        command: MunicipalitiesFindOneQuery
    ): Observable<MunicipalitiesFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
