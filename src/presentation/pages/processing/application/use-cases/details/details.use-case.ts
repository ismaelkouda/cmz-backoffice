import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { DetailsFilterDto } from '@presentation/pages/processing/application/dto/details/details-filter.dto';
import { DetailsTakeDto } from '@presentation/pages/processing/application/dto/details/details-take.dto';
import { DetailsTreatDto } from '@presentation/pages/processing/application/dto/details/details-treat.dto';
import { DetailsFilterEntity } from '@presentation/pages/processing/domain/entities/details/details-filter.entity';
import { DetailsTakeEntity } from '@presentation/pages/processing/domain/entities/details/details-take.entity';
import { DetailsTreatEntity } from '@presentation/pages/processing/domain/entities/details/details-treat.entity';
import { DetailsEntity } from '@presentation/pages/processing/domain/entities/details/details.entity';
import { DetailsRepository } from '@presentation/pages/processing/domain/repositories/details/details-repository';
import { DetailsFilterVo } from '@presentation/pages/processing/domain/value-objects/details/details-filter.vo';
import { DetailsTakeVo } from '@presentation/pages/processing/domain/value-objects/details/details-take.vo';
import { DetailsTreatVo } from '@presentation/pages/processing/domain/value-objects/details/details-treat.vo';

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

    treat(dto: DetailsTreatDto): Observable<SimpleResponseDto<void>> {
        const vo = DetailsTreatVo.fromDto(dto);
        const entity = DetailsTreatEntity.fromVo(vo);
        return this.repository.treat(entity);
    }
}
