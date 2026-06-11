import { inject, Injectable } from '@angular/core';
import { DetailsApproveDto } from '@pages/report-states/application/dto/details/details-approve.dto';
import { DetailsFilterDto } from '@pages/report-states/application/dto/details/details-filter.dto';
import { DetailsRejectDto } from '@pages/report-states/application/dto/details/details-reject.dto';
import { DetailsTakeDto } from '@pages/report-states/application/dto/details/details-take.dto';
import { DetailsApproveEntity } from '@pages/report-states/domain/entities/details/details-approve.entity';
import { DetailsFilterEntity } from '@pages/report-states/domain/entities/details/details-filter.entity';
import { DetailsRejectEntity } from '@pages/report-states/domain/entities/details/details-reject.entity';
import { DetailsTakeEntity } from '@pages/report-states/domain/entities/details/details-take.entity';
import { DetailsEntity } from '@pages/report-states/domain/entities/details/details.entity';
import { DetailsRepository } from '@pages/report-states/domain/repositories/details/details-repository';
import { DetailsApproveVo } from '@pages/report-states/domain/value-objects/details/details-approve.vo';
import { DetailsFilterVo } from '@pages/report-states/domain/value-objects/details/details-filter.vo';
import { DetailsRejectVo } from '@pages/report-states/domain/value-objects/details/details-reject.vo';
import { DetailsTakeVo } from '@pages/report-states/domain/value-objects/details/details-take.vo';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DetailsUseCase {
    private readonly repository = inject(DetailsRepository);

    execute(
        filterDto: DetailsFilterDto,
        options?: FetchOptions
    ): Observable<DetailsEntity> {
        const vo = DetailsFilterVo.fromDto(filterDto);
        const filter = DetailsFilterEntity.fromVo(vo);
        return this.repository.execute(filter, options);
    }

    take(dto: DetailsTakeDto): Observable<SimpleResponseDto<void>> {
        const vo = DetailsTakeVo.fromDto(dto);
        const entity = DetailsTakeEntity.fromVo(vo);
        return this.repository.take(entity);
    }

    approve(dto: DetailsApproveDto): Observable<SimpleResponseDto<void>> {
        const vo = DetailsApproveVo.fromDto(dto);
        const entity = DetailsApproveEntity.fromVo(vo);
        return this.repository.approve(entity);
    }

    reject(dto: DetailsRejectDto): Observable<SimpleResponseDto<void>> {
        const vo = DetailsRejectVo.fromDto(dto);
        const entity = DetailsRejectEntity.fromVo(vo);
        return this.repository.reject(entity);
    }
}
