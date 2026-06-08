import { inject, Injectable } from '@angular/core';
import { AllFilterDto } from '@pages/requests/application/dto/all/all-filter.dto';
import { AllFilterEntity } from '@pages/requests/domain/entities/all/all-filter.entity';
import { AllEntity } from '@pages/requests/domain/entities/all/all.entity';
import { AllRepository } from '@pages/requests/domain/repositories/all/all.repository';
import { AllFilterVo } from '@pages/requests/domain/value-objects/all/all-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AllUseCase {
    private readonly repository = inject(AllRepository);

    execute(
        filterDto: AllFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AllEntity>> {
        const vo = AllFilterVo.fromDto(filterDto);
        const entity = AllFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page, options);
    }
}
