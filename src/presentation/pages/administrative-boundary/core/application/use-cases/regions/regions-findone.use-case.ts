import { Injectable, inject } from '@angular/core';
import { RegionsFindoneEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/regions-findone.entity';
import { RegionsFindoneRepository } from '@presentation/pages/administrative-boundary/core/domain/repositories/regions/regions-findone-repository';
import { RegionsFindoneFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/regions/regions-findone-filter.vo';
import { Observable } from 'rxjs';
import { RegionsFindoneFilterDto } from '../../dtos/regions/regions-findone-filter.dto';

@Injectable({
    providedIn: 'root',
})
export class RegionsFindoneUseCase {
    private readonly repository = inject(RegionsFindoneRepository);

    read(
        filterDto: RegionsFindoneFilterDto,
    ): Observable<RegionsFindoneEntity> {
        const filter = RegionsFindoneFilter.create(filterDto);
        return this.repository.read(filter);
    }
}
