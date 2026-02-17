import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DetailsFilterDto } from '@presentation/pages/finalization/application/dto/details/details-filter.dto';
import { DetailsFinalizeDto } from '@presentation/pages/finalization/application/dto/details/details-finalize.dto';
import { DetailsTakeDto } from '@presentation/pages/finalization/application/dto/details/details-take.dto';
import { DetailsFilterEntity } from '@presentation/pages/finalization/domain/entities/details/details-filter.entity';
import { DetailsFinalizeEntity } from '@presentation/pages/finalization/domain/entities/details/details-finalize.entity';
import { DetailsTakeEntity } from '@presentation/pages/finalization/domain/entities/details/details-take.entity';
import { DetailsEntity } from '@presentation/pages/finalization/domain/entities/details/details.entity';
import { DetailsRepository } from '@presentation/pages/finalization/domain/repositories/details/details-repository';
import { DetailsFilterVo } from '@presentation/pages/finalization/domain/value-objects/details/details-filter.vo';
import { DetailsFinalizeVo } from '@presentation/pages/finalization/domain/value-objects/details/details-finalize.vo';
import { DetailsTakeVo } from '@presentation/pages/finalization/domain/value-objects/details/details-take.vo';

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

    finalize(dto: DetailsFinalizeDto): Observable<SimpleResponseDto<void>> {
        const vo = DetailsFinalizeVo.fromDto(dto);
        const entity = DetailsFinalizeEntity.fromVo(vo);
        return this.repository.finalize(entity);
    }
}
