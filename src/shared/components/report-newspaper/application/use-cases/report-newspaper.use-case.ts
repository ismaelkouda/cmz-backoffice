import { inject, Injectable } from '@angular/core';
import { ReportNewspaperFilterDto } from '@shared/components/report-newspaper/application/dto/report-newspaper-filter.dto';
import { ReportNewspaperFilterEntity } from '@shared/components/report-newspaper/domain/entities/report-newspaper-filter.entity';
import { ReportNewspaperEntity } from '@shared/components/report-newspaper/domain/entities/report-newspaper.entity';
import { ReportNewspaperRepository } from '@shared/components/report-newspaper/domain/repositories/report-newspaper-repository';
import { ReportNewspaperFilterVo } from '@shared/components/report-newspaper/domain/value-objects/report-newspaper-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReportNewspaperUseCase {
    private readonly repository = inject(ReportNewspaperRepository);

    execute(
        filterDto: ReportNewspaperFilterDto,
        options?: FetchOptions
    ): Observable<ReportNewspaperEntity[]> {
        const vo = ReportNewspaperFilterVo.fromDto(filterDto);
        const filter = ReportNewspaperFilterEntity.fromVo(vo);
        return this.repository.execute(filter, options);
    }
}
