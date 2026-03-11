import { inject, Injectable } from '@angular/core';
import { AllFilterDto } from '@pages/finalization/application/dto/all/all-filter.dto';
import { AllFilterEntity } from '@pages/finalization/domain/entities/all/all-filter.entity';
import { AllEntity } from '@pages/finalization/domain/entities/all/all.entity';
import { AllRepository } from '@pages/finalization/domain/repositories/all/all.repository';
import { AllFilterVo } from '@pages/finalization/domain/value-objects/all/all-filter.vo';
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
