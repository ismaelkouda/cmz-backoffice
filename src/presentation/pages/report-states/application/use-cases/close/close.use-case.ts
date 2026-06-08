import { inject, Injectable } from '@angular/core';
import { CloseFilterDto } from '@pages/report-states/application/dto/close/close-filter.dto';
import { CloseFilterEntity } from '@pages/report-states/domain/entities/close/close-filter.entity';
import { CloseEntity } from '@pages/report-states/domain/entities/close/close.entity';
import { CloseRepository } from '@pages/report-states/domain/repositories/close/close.repository';
import { CloseFilterVo } from '@pages/report-states/domain/value-objects/close/close-filter.vo';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CloseUseCase {
    private readonly repository = inject(CloseRepository);

    execute(
        filterDto: CloseFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<CloseEntity>> {
        const vo = CloseFilterVo.fromDto(filterDto);
        const entity = CloseFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page, options);
    }
}
