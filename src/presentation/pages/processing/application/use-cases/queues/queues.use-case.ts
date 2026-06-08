import { inject, Injectable } from '@angular/core';
import { QueuesFilterDto } from '@pages/processing/application/dto/queues/queues-filter.dto';
import { QueuesFilterEntity } from '@pages/processing/domain/entities/queues/queues-filter.entity';
import { QueuesEntity } from '@pages/processing/domain/entities/queues/queues.entity';
import { QueuesRepository } from '@pages/processing/domain/repositories/queues/queues.repository';
import { QueuesFilterVo } from '@pages/processing/domain/value-objects/queues/queues-filter.vo';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class QueuesUseCase {
    private readonly repository = inject(QueuesRepository);

    execute(
        filterDto: QueuesFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<QueuesEntity>> {
        const vo = QueuesFilterVo.fromDto(filterDto);
        const entity = QueuesFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page, options);
    }
}
