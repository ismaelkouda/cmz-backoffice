import { Injectable, inject } from '@angular/core';
import { MunicipalitiesFindoneEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/municipalities/municipalities-findone.entity';
import { MunicipalitiesFindoneRepository } from '@presentation/pages/administrative-boundary/core/domain/repositories/municipalities/municipalities-findone-repository';
import { MunicipalitiesFindoneFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-findone-filter.vo';
import { Observable } from 'rxjs';
import { MunicipalitiesFindoneFilterDto } from '../../dtos/municipalities/municipalities-findone-filter.dto';

@Injectable({
    providedIn: 'root'
})
export class MunicipalitiesFindoneUseCase {
    private readonly repository = inject(MunicipalitiesFindoneRepository);

    read(
        filterDto: MunicipalitiesFindoneFilterDto,
    ): Observable<MunicipalitiesFindoneEntity> {
        const filter = MunicipalitiesFindoneFilter.create(filterDto);
        console.log('MunicipalitiesFindoneUseCase', filter);
        return this.repository.read(filter);
    }
}
