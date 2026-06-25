import { inject, Injectable } from '@angular/core';
import { ApproveFilterDto } from '@pages/report-states/application/dto/approve/approve-filter.dto';
import { ApproveFilterEntity } from '@pages/report-states/domain/entities/approve/approve-filter.entity';
import { ApproveEntity } from '@pages/report-states/domain/entities/approve/approve.entity';
import { ApproveRepository } from '@pages/report-states/domain/repositories/approve/approve.repository';
import { ApproveFilterVo } from '@pages/report-states/domain/value-objects/approve/approve-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApproveUseCase {
    private readonly repository = inject(ApproveRepository);

    execute(
        filterDto: ApproveFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ApproveEntity>> {
        const vo = ApproveFilterVo.fromDto(filterDto);
        const entity = ApproveFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page, options);
    }
}
