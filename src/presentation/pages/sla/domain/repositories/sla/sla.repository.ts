import { SlaFilterEntity } from '@pages/sla/domain/entities/sla/sla-filter.entity';
import { SlaEntity } from '@pages/sla/domain/entities/sla/sla.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { SlaCreateContract } from '@pages/sla/domain/contracts/sla/sla-create.contract';
import { SlaUpdateContract } from '@pages/sla/domain/contracts/sla/sla-update.contract';
import { SlaEnableDto } from '@pages/sla/application/dto/sla/sla-enable.dto';
import { SlaDisableDto } from '@pages/sla/application/dto/sla/sla-disable.dto';
import { SlaDeleteDto } from '@pages/sla/application/dto/sla/sla-delete.dto';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class SlaRepository {
    abstract readAll(
        entity: SlaFilterEntity | null,
        options?: FetchOptions
    ): Observable<SlaEntity[]>;
    abstract create(dto: SlaCreateContract): Observable<MessageResponseDto>;
    abstract update(dto: SlaUpdateContract): Observable<MessageResponseDto>;
    abstract enable(dto: SlaEnableDto): Observable<MessageResponseDto>;
    abstract disable(dto: SlaDisableDto): Observable<MessageResponseDto>;
    abstract delete(dto: SlaDeleteDto): Observable<MessageResponseDto>;
}
