import { inject, Injectable } from '@angular/core';
import { DetailsFilterDto } from '@pages/finalization/application/dto/details/details-filter.dto';
import { DetailsFinalizeDto } from '@pages/finalization/application/dto/details/details-finalize.dto';
import { DetailsTakeDto } from '@pages/finalization/application/dto/details/details-take.dto';
import { DetailsFilterEntity } from '@pages/finalization/domain/entities/details/details-filter.entity';
import { DetailsFinalizeEntity } from '@pages/finalization/domain/entities/details/details-finalize.entity';
import { DetailsTakeEntity } from '@pages/finalization/domain/entities/details/details-take.entity';
import { DetailsEntity } from '@pages/finalization/domain/entities/details/details.entity';
import { DetailsRepository } from '@pages/finalization/domain/repositories/details/details-repository';
import { DetailsFilterVo } from '@pages/finalization/domain/value-objects/details/details-filter.vo';
import { DetailsFinalizeVo } from '@pages/finalization/domain/value-objects/details/details-finalize.vo';
import { DetailsTakeVo } from '@pages/finalization/domain/value-objects/details/details-take.vo';
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

    finalize(dto: DetailsFinalizeDto): Observable<SimpleResponseDto<void>> {
        const vo = DetailsFinalizeVo.fromDto(dto);
        const entity = DetailsFinalizeEntity.fromVo(vo);
        return this.repository.finalize(entity);
    }
}
