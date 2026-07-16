import { Injectable, inject } from '@angular/core';
import { RegionsDeleteDto } from '@pages/administrative-boundary/application/dto/regions/regions-delete.dto';
import { RegionsFilterDto } from '@pages/administrative-boundary/application/dto/regions/regions-filter.dto';
import { RegionsDeleteEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-delete.entity';
import { RegionsFilterEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-filter.entity';
import { RegionsEntity } from '@pages/administrative-boundary/domain/entities/regions/regions.entity';
import { RegionsRepository } from '@pages/administrative-boundary/domain/repositories/regions/regions-repository';
import { RegionsDeleteVo } from '@pages/administrative-boundary/domain/value-objects/regions/regions-delete.vo';
import { RegionsFilterVo } from '@pages/administrative-boundary/domain/value-objects/regions/regions-filter.vo';
import { regionsCreateVo } from '@presentation/pages/administrative-boundary/domain/value-objects/regions/regions-create.vo';
import { regionsUpdateVo } from '@presentation/pages/administrative-boundary/domain/value-objects/regions/regions-update.vo';
import { RegionsCreateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-create.contract';
import { RegionsUpdateContract } from '@presentation/pages/administrative-boundary/domain/contracts/regions/regions-update.contract';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable, defer } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RegionsUseCase {
    private readonly repository = inject(RegionsRepository);

    execute(
        dto: RegionsFilterDto,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RegionsEntity>> {
        return defer(() => {
            const vo = RegionsFilterVo.fromDto(dto);
            const entity = RegionsFilterEntity.fromVo(vo);
            return this.repository.execute(entity, page, options);
        });
    }

    create(
        createDto: RegionsCreateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.create(regionsCreateVo(createDto)));
    }

    update(
        updateDto: RegionsUpdateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.update(regionsUpdateVo(updateDto)));
    }

    delete(deleteDto: RegionsDeleteDto): Observable<SimpleResponseDto<void>> {
        return defer(() => {
            const vo = RegionsDeleteVo.fromDto(deleteDto);
            const entity = RegionsDeleteEntity.fromVo(vo);
            return this.repository.delete(entity);
        });
    }
}
