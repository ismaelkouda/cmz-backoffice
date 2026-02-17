import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DetailsApproveDto } from '@presentation/pages/requests/application/dto/details/details-approve.dto';
import { DetailsFilterDto } from '@presentation/pages/requests/application/dto/details/details-filter.dto';
import { DetailsRejectDto } from '@presentation/pages/requests/application/dto/details/details-reject.dto';
import { DetailsTakeDto } from '@presentation/pages/requests/application/dto/details/details-take.dto';
import { DetailsApproveEntity } from '@presentation/pages/requests/domain/entities/details/details-approve.entity';
import { DetailsFilterEntity } from '@presentation/pages/requests/domain/entities/details/details-filter.entity';
import { DetailsRejectEntity } from '@presentation/pages/requests/domain/entities/details/details-reject.entity';
import { DetailsTakeEntity } from '@presentation/pages/requests/domain/entities/details/details-take.entity';
import { DetailsEntity } from '@presentation/pages/requests/domain/entities/details/details.entity';
import { DetailsRepository } from '@presentation/pages/requests/domain/repositories/details/details-repository';
import { DetailsApproveVo } from '@presentation/pages/requests/domain/value-objects/details/details-approve.vo';
import { DetailsFilterVo } from '@presentation/pages/requests/domain/value-objects/details/details-filter.vo';
import { DetailsRejectVo } from '@presentation/pages/requests/domain/value-objects/details/details-reject.vo';
import { DetailsTakeVo } from '@presentation/pages/requests/domain/value-objects/details/details-take.vo';

@Injectable({
    providedIn: 'root',
})
export class DetailsUseCase {
    private readonly repository = inject(DetailsRepository);

    execute(filterDto: DetailsFilterDto): Observable<DetailsEntity> {
        const vo = DetailsFilterVo.fromDto(filterDto);
        const filter = DetailsFilterEntity.fromVo(vo);
        return this.repository.execute(filter);
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
