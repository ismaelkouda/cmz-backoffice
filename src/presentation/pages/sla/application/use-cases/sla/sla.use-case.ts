import { inject, Injectable } from '@angular/core';
import { SlaFilterDto } from '@pages/sla/application/dto/sla/sla-filter.dto';
import { SlaEntity } from '@pages/sla/domain/entities/sla/sla.entity';
import { SlaRepository } from '@pages/sla/domain/repositories/sla/sla.repository';
import { slaFilterVoFromDto } from '@pages/sla/domain/value-objects/sla/sla-filter.vo';
import { Observable } from 'rxjs';
import { SlaCreateContract } from '@pages/sla/domain/contracts/sla/sla-create.contract';
import { SlaUpdateContract } from '@pages/sla/domain/contracts/sla/sla-update.contract';
import { SlaEnableDto } from '@pages/sla/application/dto/sla/sla-enable.dto';
import { SlaDisableDto } from '@pages/sla/application/dto/sla/sla-disable.dto';
import { SlaDeleteDto } from '@pages/sla/application/dto/sla/sla-delete.dto';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class SlaUseCase {
    private readonly repository = inject(SlaRepository);

    execute(
        filterDto: SlaFilterDto | null,
        options?: FetchOptions
    ): Observable<SlaEntity[]> {
        const entity = slaFilterVoFromDto(filterDto);
        return this.repository.readAll(entity, options);
    }

    create(dto: SlaCreateContract): Observable<MessageResponseDto> {
        return this.repository.create(dto);
    }
    update(dto: SlaUpdateContract): Observable<MessageResponseDto> {
        return this.repository.update(dto);
    }
    enable(dto: SlaEnableDto): Observable<MessageResponseDto> {
        return this.repository.enable(dto);
    }
    disable(dto: SlaDisableDto): Observable<MessageResponseDto> {
        return this.repository.disable(dto);
    }
    delete(dto: SlaDeleteDto): Observable<MessageResponseDto> {
        return this.repository.delete(dto);
    }
}
