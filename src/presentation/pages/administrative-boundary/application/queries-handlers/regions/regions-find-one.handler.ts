import { inject, Injectable } from '@angular/core';
import { RegionsFindOneQuery } from '@pages/administrative-boundary/application/queries/regions/regions-find-one.query';
import { RegionsFindOneUseCase } from '@pages/administrative-boundary/application/use-cases/regions/regions-find-one.use-case';
import { RegionsFindOneEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegionsFindOneHandler {
    private readonly useCase = inject(RegionsFindOneUseCase);

    execute(command: RegionsFindOneQuery): Observable<RegionsFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
