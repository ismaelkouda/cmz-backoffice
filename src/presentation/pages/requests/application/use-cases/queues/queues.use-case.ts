import { inject, Injectable } from '@angular/core';
import { QueuesFilterDto } from '@pages/requests/application/dto/queues/queues-filter.dto';
import { QueuesFilterEntity } from '@pages/requests/domain/entities/queues/queues-filter.entity';
import { QueuesEntity } from '@pages/requests/domain/entities/queues/queues.entity';
import { QueuesRepository } from '@pages/requests/domain/repositories/queues/queues.repository';
import { QueuesFilterVo } from '@pages/requests/domain/value-objects/queues/queues-filter.vo';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class QueuesUseCase {
    private readonly repository = inject(QueuesRepository);

    execute(
        filterDto: QueuesFilterDto | null,
        page: string
    ): Observable<Paginate<QueuesEntity>> {
        const vo = QueuesFilterVo.fromDto(filterDto);
        const entity = QueuesFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page);
    }
}
