import { Injectable, inject } from '@angular/core';
import { RegionsCreateDto } from '@pages/administrative-boundary/application/dto/regions/regions-create.dto';
import { RegionsDeleteDto } from '@pages/administrative-boundary/application/dto/regions/regions-delete.dto';
import { RegionsFilterDto } from '@pages/administrative-boundary/application/dto/regions/regions-filter.dto';
import { RegionsUpdateDto } from '@pages/administrative-boundary/application/dto/regions/regions-update.dto';
import { RegionsCreateEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-create.entity';
import { RegionsDeleteEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-delete.entity';
import { RegionsFilterEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-filter.entity';
import { RegionsUpdateEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-update.entity';
import { RegionsEntity } from '@pages/administrative-boundary/domain/entities/regions/regions.entity';
import { RegionsRepository } from '@pages/administrative-boundary/domain/repositories/regions/regions-repository';
import { RegionsCreateVo } from '@pages/administrative-boundary/domain/value-objects/regions/regions-create.vo';
import { RegionsDeleteVo } from '@pages/administrative-boundary/domain/value-objects/regions/regions-delete.vo';
import { RegionsFilterVo } from '@pages/administrative-boundary/domain/value-objects/regions/regions-filter.vo';
import { RegionsUpdateVo } from '@pages/administrative-boundary/domain/value-objects/regions/regions-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RegionsUseCase {
    private readonly repository = inject(RegionsRepository);

    execute(
        dto: RegionsFilterDto,
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
