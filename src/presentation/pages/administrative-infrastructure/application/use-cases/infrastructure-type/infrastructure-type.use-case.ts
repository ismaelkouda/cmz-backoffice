import { inject, Injectable } from '@angular/core';
import { InfrastructureTypeCreateDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-create.dto';
import { InfrastructureTypeDeleteDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-delete.dto';
import { InfrastructureTypeDisableDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-disable.dto';
import { InfrastructureTypeEnableDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-enable.dto';
import { InfrastructureTypeFilterDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-filter.dto';
import { InfrastructureTypeUpdateDto } from '@presentation/pages/administrative-infrastructure/application/dto/infrastructure-type/infrastructure-type-update.dto';
import { InfrastructureTypeCreateEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-create.entity';
import { InfrastructureTypeDeleteEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-delete.entity';
import { InfrastructureTypeDisableEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-disable.entity';
import { InfrastructureTypeEnableEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-enable.entity';
import { InfrastructureTypeFilterEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-filter.entity';
import { InfrastructureTypeUpdateEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type-update.entity';
import { InfrastructureTypeEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure-type/infrastructure-type.entity';
import { InfrastructureTypeRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure-type/infrastructure-type-repository';
import { InfrastructureTypeCreateVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-create.vo';
import { InfrastructureTypeDeleteVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-delete.vo';
import { InfrastructureTypeDisableVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-disable.vo';
import { InfrastructureTypeEnableVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-enable.vo';
import { InfrastructureTypeFilterVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-filter.vo';
import { InfrastructureTypeUpdateVo } from '@presentation/pages/administrative-infrastructure/domain/value-objects/infrastructure-type/infrastructure-type-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureTypeUseCase {
    private readonly repository = inject(InfrastructureTypeRepository);

    execute(
        dto: InfrastructureTypeFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<InfrastructureTypeEntity>> {
        const vo = InfrastructureTypeFilterVo.fromDto(dto);
        const entity = InfrastructureTypeFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page, options);
    }

    create(
        dto: InfrastructureTypeCreateDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = InfrastructureTypeCreateVo.fromDto(dto);
        const entity = InfrastructureTypeCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(
        dto: InfrastructureTypeUpdateDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = InfrastructureTypeUpdateVo.fromDto(dto);
        const entity = InfrastructureTypeUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    delete(
        dto: InfrastructureTypeDeleteDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = InfrastructureTypeDeleteVo.fromDto(dto);
        const entity = InfrastructureTypeDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }

    enable(
        dto: InfrastructureTypeEnableDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = InfrastructureTypeEnableVo.fromDto(dto);
        const entity = InfrastructureTypeEnableEntity.fromVo(vo);
        return this.repository.enable(entity);
    }

    disable(
        dto: InfrastructureTypeDisableDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = InfrastructureTypeDisableVo.fromDto(dto);
        const entity = InfrastructureTypeDisableEntity.fromVo(vo);
        return this.repository.disable(entity);
    }
}
