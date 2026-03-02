import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { RegionsCreateDto } from '@presentation/pages/administrative-boundary/application/dto/regions/regions-create.dto';
import { RegionsDeleteDto } from '@presentation/pages/administrative-boundary/application/dto/regions/regions-delete.dto';
import { RegionsFilterDto } from '@presentation/pages/administrative-boundary/application/dto/regions/regions-filter.dto';
import { RegionsUpdateDto } from '@presentation/pages/administrative-boundary/application/dto/regions/regions-update.dto';
import { RegionsCreateEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-create.entity';
import { RegionsDeleteEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-delete.entity';
import { RegionsFilterEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-filter.entity';
import { RegionsUpdateEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-update.entity';
import { RegionsEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions.entity';
import { RegionsRepository } from '@presentation/pages/administrative-boundary/domain/repositories/regions/regions-repository';
import { RegionsCreateVo } from '@presentation/pages/administrative-boundary/domain/value-objects/regions/regions-create.vo';
import { RegionsDeleteVo } from '@presentation/pages/administrative-boundary/domain/value-objects/regions/regions-delete.vo';
import { RegionsFilterVo } from '@presentation/pages/administrative-boundary/domain/value-objects/regions/regions-filter.vo';
import { RegionsUpdateVo } from '@presentation/pages/administrative-boundary/domain/value-objects/regions/regions-update.vo';

@Injectable({
    providedIn: 'root',
})
export class RegionsUseCase {
    private readonly repository = inject(RegionsRepository);

    execute(
        dto: RegionsFilterDto | null,
        page: string
    ): Observable<Paginate<RegionsEntity>> {
        const vo = RegionsFilterVo.fromDto(dto);
        const entity = RegionsFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page);
    }

    create(createDto: RegionsCreateDto): Observable<SimpleResponseDto<void>> {
        const vo = RegionsCreateVo.fromDto(createDto);
        const entity = RegionsCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(updateDto: RegionsUpdateDto): Observable<SimpleResponseDto<void>> {
        const vo = RegionsUpdateVo.fromDto(updateDto);
        const entity = RegionsUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    delete(deleteDto: RegionsDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = RegionsDeleteVo.fromDto(deleteDto);
        const entity = RegionsDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
