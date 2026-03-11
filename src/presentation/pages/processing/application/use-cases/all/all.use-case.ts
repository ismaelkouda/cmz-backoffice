import { inject, Injectable } from '@angular/core';
import { AllFilterDto } from '@pages/processing/application/dto/all/all-filter.dto';
import { AllFilterEntity } from '@pages/processing/domain/entities/all/all-filter.entity';
import { AllEntity } from '@pages/processing/domain/entities/all/all.entity';
import { AllRepository } from '@pages/processing/domain/repositories/all/all.repository';
import { AllFilterVo } from '@pages/processing/domain/value-objects/all/all-filter.vo';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
