import { inject, Injectable } from '@angular/core';
import { EvaluateFilterDto } from '@pages/report-states/application/dto/evaluate/evaluate-filter.dto';
import { EvaluateFilterEntity } from '@pages/report-states/domain/entities/evaluate/evaluate-filter.entity';
import { EvaluateEntity } from '@pages/report-states/domain/entities/evaluate/evaluate.entity';
import { EvaluateRepository } from '@pages/report-states/domain/repositories/evaluate/evaluate.repository';
import { EvaluateFilterVo } from '@pages/report-states/domain/value-objects/evaluate/evaluate-filter.vo';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EvaluateUseCase {
    private readonly repository = inject(EvaluateRepository);

    execute(
        filterDto: EvaluateFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<EvaluateEntity>> {
        const vo = EvaluateFilterVo.fromDto(filterDto);
        const entity = EvaluateFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page, options);
    }
}
