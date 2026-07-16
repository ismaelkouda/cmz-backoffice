import { Injectable, inject } from '@angular/core';
import { MunicipalitiesDeleteDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-delete.dto';
import { MunicipalitiesFilterDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-filter.dto';
import { MunicipalitiesDeleteEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-delete.entity';
import { MunicipalitiesFilterEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-filter.entity';
import { MunicipalitiesEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';
import { MunicipalitiesRepository } from '@pages/administrative-boundary/domain/repositories/municipalities/municipalities-repository';
import { MunicipalitiesDeleteVo } from '@pages/administrative-boundary/domain/value-objects/municipalities/municipalities-delete.vo';
import { MunicipalitiesFilterVo } from '@pages/administrative-boundary/domain/value-objects/municipalities/municipalities-filter.vo';
import { municipalitiesCreateVo } from '@presentation/pages/administrative-boundary/domain/value-objects/municipalities/municipalities-create.vo';
import { municipalitiesUpdateVo } from '@presentation/pages/administrative-boundary/domain/value-objects/municipalities/municipalities-update.vo';
import { MunicipalitiesCreateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-create.contract';
import { MunicipalitiesUpdateContract } from '@presentation/pages/administrative-boundary/domain/contracts/municipalities/municipalities-update.contract';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, defer } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesUseCase {
    private readonly repository = inject(MunicipalitiesRepository);

    execute(
        dto: MunicipalitiesFilterDto,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MunicipalitiesEntity>> {
        return defer(() => {
            const vo = MunicipalitiesFilterVo.fromDto(dto);
            const entity = MunicipalitiesFilterEntity.fromVo(vo);
            return this.repository.execute(entity, page, options);
        });
    }

    create(
        createDto: MunicipalitiesCreateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() =>
            this.repository.create(municipalitiesCreateVo(createDto))
        );
    }

    update(
        updateDto: MunicipalitiesUpdateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() =>
            this.repository.update(municipalitiesUpdateVo(updateDto))
        );
    }

    delete(
        deleteDto: MunicipalitiesDeleteDto
    ): Observable<SimpleResponseDto<void>> {
        return defer(() => {
            const vo = MunicipalitiesDeleteVo.fromDto(deleteDto);
            const entity = MunicipalitiesDeleteEntity.fromVo(vo);
            return this.repository.delete(entity);
        });
    }
}
