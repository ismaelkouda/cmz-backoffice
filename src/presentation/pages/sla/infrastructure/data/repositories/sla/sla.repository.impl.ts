import { inject, Injectable } from '@angular/core';
import { SlaFilterEntity } from '@pages/sla/domain/entities/sla/sla-filter.entity';
import { SlaEntity } from '@pages/sla/domain/entities/sla/sla.entity';
import { SlaRepository } from '@pages/sla/domain/repositories/sla/sla.repository';
import { SlaFilterMapper } from '@pages/sla/infrastructure/data/mappers/sla/sla-filter.mapper';
import { SlaMapper } from '@pages/sla/infrastructure/data/mappers/sla/sla.mapper';
import { SlaApi } from '@pages/sla/infrastructure/data/sources/sla/sla.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';
import { SlaCreateContract } from '@pages/sla/domain/contracts/sla/sla-create.contract';
import { SlaUpdateContract } from '@pages/sla/domain/contracts/sla/sla-update.contract';
import { SlaEnableDto } from '@pages/sla/application/dto/sla/sla-enable.dto';
import { SlaDisableDto } from '@pages/sla/application/dto/sla/sla-disable.dto';
import { SlaDeleteDto } from '@pages/sla/application/dto/sla/sla-delete.dto';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({
    providedIn: 'root',
})
export class SlaRepositoryImpl implements SlaRepository {
    private readonly api = inject(SlaApi);
    private readonly mapper = inject(SlaMapper);
    private readonly filterMapper = inject(SlaFilterMapper);

    readAll(
        entity: SlaFilterEntity | null,
        options?: FetchOptions
    ): Observable<SlaEntity[]> {
        const paramsDto = this.filterMapper.map(entity);
        return this.api
            .execute(paramsDto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(dto: SlaCreateContract): Observable<MessageResponseDto> {
        return this.api.create(dto);
    }
    update(dto: SlaUpdateContract): Observable<MessageResponseDto> {
        return this.api.update(dto);
    }
    enable(dto: SlaEnableDto): Observable<MessageResponseDto> {
        return this.api.enable(dto);
    }
    disable(dto: SlaDisableDto): Observable<MessageResponseDto> {
        return this.api.disable(dto);
    }
    delete(dto: SlaDeleteDto): Observable<MessageResponseDto> {
        return this.api.delete(dto);
    }
}
