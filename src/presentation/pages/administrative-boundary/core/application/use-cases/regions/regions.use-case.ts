import { Injectable, inject } from '@angular/core';
import { RegionsEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/regions/regions.entity';
import { RegionsRepository } from '@presentation/pages/administrative-boundary/core/domain/repositories/regions/regions-repository';
import { RegionsFilter } from '@presentation/pages/administrative-boundary/core/domain/value-objects/regions/regions-filter.vo';
import { Paginate, SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { RegionsCreate } from '../../../domain/value-objects/regions/regions-create.vo';
import { RegionsUpdate } from '../../../domain/value-objects/regions/regions-update.vo';
import { RegionsCreateDto } from '../../dtos/regions/regions-create.dto';
import { RegionsFilterDto } from '../../dtos/regions/regions-filter.dto';
import { RegionsUpdateDto } from '../../dtos/regions/regions-update.dto';

@Injectable({
    providedIn: 'root',
})
export class RegionsUseCase {
    private readonly repository = inject(RegionsRepository);

    readAll(
        filterDto: RegionsFilterDto | null,
        page: string
    ): Observable<Paginate<RegionsEntity>> {
        const filter = RegionsFilter.create(filterDto);
        return this.repository.readAll(filter, page);
    }

    create(payloadDto: RegionsCreateDto): Observable<SimpleResponseDto<void>> {
        const payload = RegionsCreate.create(payloadDto);
        return this.repository.create(payload);
    }

    update(payloadDto: RegionsUpdateDto): Observable<SimpleResponseDto<void>> {
        const payload = RegionsUpdate.create(payloadDto);
        return this.repository.update(payload);
    }

    delete(code: string): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(code);
    }
}
