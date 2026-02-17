import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { AllFilterDto } from '@presentation/pages/processing/application/dto/all/all-filter.dto';
import { AllFilterEntity } from '@presentation/pages/processing/domain/entities/all/all-filter.entity';
import { AllEntity } from '@presentation/pages/processing/domain/entities/all/all.entity';
import { AllRepository } from '@presentation/pages/processing/domain/repositories/all/all.repository';
import { AllFilterVo } from '@presentation/pages/processing/domain/value-objects/all/all-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class AllUseCase {
    private readonly repository = inject(AllRepository);

    execute(
        filterDto: AllFilterDto | null,
        page: string
    ): Observable<Paginate<AllEntity>> {
        const vo = AllFilterVo.fromDto(filterDto);
        const entity = AllFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page);
    }
}
