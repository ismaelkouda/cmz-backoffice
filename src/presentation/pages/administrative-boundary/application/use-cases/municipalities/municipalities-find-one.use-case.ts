import { Injectable, inject } from '@angular/core';
import { MunicipalitiesFindOneFilterDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-find-one-filter.dto';
import { MunicipalitiesFindOneFilterEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one-filter.entity';
import { MunicipalitiesFindOneEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one.entity';
import { MunicipalitiesFindOneRepository } from '@pages/administrative-boundary/domain/repositories/municipalities/municipalities-find-one-repository';
import { MunicipalitiesFindOneFilterVo } from '@pages/administrative-boundary/domain/value-objects/municipalities/municipalities-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesFindOneUseCase {
    private readonly repository = inject(MunicipalitiesFindOneRepository);

    execute(
        dto: MunicipalitiesFindOneFilterDto,
        options?: FetchOptions
    ): Observable<MunicipalitiesFindOneEntity> {
        const vo = MunicipalitiesFindOneFilterVo.fromDto(dto);
        const filter = MunicipalitiesFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter, options);
    }
}
