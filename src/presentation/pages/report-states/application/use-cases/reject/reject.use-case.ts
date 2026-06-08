import { inject, Injectable } from '@angular/core';
import { RejectFilterDto } from '@pages/report-states/application/dto/reject/reject-filter.dto';
import { RejectFilterEntity } from '@pages/report-states/domain/entities/reject/reject-filter.entity';
import { RejectEntity } from '@pages/report-states/domain/entities/reject/reject.entity';
import { RejectRepository } from '@pages/report-states/domain/repositories/reject/reject.repository';
import { RejectFilterVo } from '@pages/report-states/domain/value-objects/reject/reject-filter.vo';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RejectUseCase {
    private readonly repository = inject(RejectRepository);

    execute(
        filterDto: RejectFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RejectEntity>> {
        const vo = RejectFilterVo.fromDto(filterDto);
        const entity = RejectFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page, options);
    }
}
