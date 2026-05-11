import { inject, Injectable } from '@angular/core';
import { EvaluateFilterEntity } from '@pages/report-states/domain/entities/evaluate/evaluate-filter.entity';
import { EvaluateEntity } from '@pages/report-states/domain/entities/evaluate/evaluate.entity';
import { EvaluateRepository } from '@pages/report-states/domain/repositories/evaluate/evaluate.repository';
import { EvaluateFilterMapper } from '@pages/report-states/infrastructure/data/mappers/evaluate/evaluate-filter.mapper';
import { EvaluateMapper } from '@pages/report-states/infrastructure/data/mappers/evaluate/evaluate.mapper';
import { EvaluateApi } from '@pages/report-states/infrastructure/data/sources/evaluate/evaluate.api';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EvaluateRepositoryImpl extends EvaluateRepository {
    private readonly api = inject(EvaluateApi);
    private readonly mapper = inject(EvaluateMapper);
    private readonly filterMapper = inject(EvaluateFilterMapper);

    execute(
        entity: EvaluateFilterEntity,
        page: string
    ): Observable<Paginate<EvaluateEntity>> {
        const paramsDto = this.filterMapper.map(entity);
        return this.api
            .execute(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
