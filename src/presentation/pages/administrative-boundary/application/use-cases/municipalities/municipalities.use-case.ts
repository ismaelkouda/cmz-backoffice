import { Injectable, inject } from '@angular/core';
import { MunicipalitiesCreateDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-create.dto';
import { MunicipalitiesDeleteDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-delete.dto';
import { MunicipalitiesFilterDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-filter.dto';
import { MunicipalitiesUpdateDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-update.dto';
import { MunicipalitiesCreateEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-create.entity';
import { MunicipalitiesDeleteEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-delete.entity';
import { MunicipalitiesFilterEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-filter.entity';
import { MunicipalitiesUpdateEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-update.entity';
import { MunicipalitiesEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';
import { MunicipalitiesRepository } from '@pages/administrative-boundary/domain/repositories/municipalities/municipalities-repository';
import { MunicipalitiesCreateVo } from '@pages/administrative-boundary/domain/value-objects/municipalities/municipalities-create.vo';
import { MunicipalitiesDeleteVo } from '@pages/administrative-boundary/domain/value-objects/municipalities/municipalities-delete.vo';
import { MunicipalitiesFilterVo } from '@pages/administrative-boundary/domain/value-objects/municipalities/municipalities-filter.vo';
import { MunicipalitiesUpdateVo } from '@pages/administrative-boundary/domain/value-objects/municipalities/municipalities-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesUseCase {
    private readonly repository = inject(MunicipalitiesRepository);

    execute(
        dto: MunicipalitiesFilterDto,
        page: string
    ): Observable<Paginate<MunicipalitiesEntity>> {
        const vo = MunicipalitiesFilterVo.fromDto(dto);
        const entity = MunicipalitiesFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page);
    }

    create(
        createDto: MunicipalitiesCreateDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = MunicipalitiesCreateVo.fromDto(createDto);
        const entity = MunicipalitiesCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(
        updateDto: MunicipalitiesUpdateDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = MunicipalitiesUpdateVo.fromDto(updateDto);
        const entity = MunicipalitiesUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    delete(
        deleteDto: MunicipalitiesDeleteDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = MunicipalitiesDeleteVo.fromDto(deleteDto);
        const entity = MunicipalitiesDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
