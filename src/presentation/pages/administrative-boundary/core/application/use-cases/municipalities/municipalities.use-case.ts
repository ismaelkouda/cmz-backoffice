import { Injectable, inject } from '@angular/core';
import { MunicipalitiesEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/municipalities/municipalities.entity';
import { MunicipalitiesRepository } from '@presentation/pages/administrative-boundary/core/domain/repositories/municipalities/municipalities-repository';
import { MunicipalitiesFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/municipalities/municipalities-filter.vo';
import { Paginate, SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { MunicipalitiesCreate } from '../../../domain/value-objects/municipalities/municipalities-create.vo';
import { MunicipalitiesUpdate } from '../../../domain/value-objects/municipalities/municipalities-update.vo';
import { MunicipalitiesCreateDto } from '../../dtos/municipalities/municipalities-create.dto';
import { MunicipalitiesFilterDto } from '../../dtos/municipalities/municipalities-filter.dto';
import { MunicipalitiesUpdateDto } from '../../dtos/municipalities/municipalities-update.dto';

@Injectable({
    providedIn: 'root'
})
export class MunicipalitiesUseCase {
    private readonly repository = inject(MunicipalitiesRepository);

    readAll(
        filterDto: MunicipalitiesFilterDto | null,
        page: string
    ): Observable<Paginate<MunicipalitiesEntity>> {
        const filter = MunicipalitiesFilter.create(filterDto);
        return this.repository.readAll(filter, page);
    }

    create(payloadDto: MunicipalitiesCreateDto): Observable<SimpleResponseDto<void>> {
        const payload = MunicipalitiesCreate.create(payloadDto);
        return this.repository.create(payload);
    }

    update(payloadDto: MunicipalitiesUpdateDto): Observable<SimpleResponseDto<void>> {
        const payload = MunicipalitiesUpdate.create(payloadDto);
        return this.repository.update(payload);
    }

    delete(code: string): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(code);
    }
}
