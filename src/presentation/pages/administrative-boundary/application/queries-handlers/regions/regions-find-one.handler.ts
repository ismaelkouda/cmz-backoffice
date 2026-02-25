import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RegionsFindOneQuery } from '@presentation/pages/administrative-boundary/application/queries/regions/regions-find-one.query';
import { RegionsFindOneUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/regions/regions-find-one.use-case';
import { RegionsFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';

@Injectable({ providedIn: 'root' })
export class RegionsFindOneHandler {
    private readonly useCase = inject(RegionsFindOneUseCase);

    execute(command: RegionsFindOneQuery): Observable<RegionsFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
