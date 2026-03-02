import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { SlideFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-find-one-filter.entity';
import { SlideFindOneEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-find-one.entity';
import { SlideFindOneRepository } from '@presentation/pages/content-management/domain/repositories/slide/slide-find-one-repository';
import { slideFindOneFilterMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/slide/slide-find-one-filter.mapper';
import { SlideFindOneMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/slide/slide-find-one.mapper';
import { SlideFindOneApi } from '@presentation/pages/content-management/infrastructure/data/sources/slide/slide-find-one.api';

@Injectable({ providedIn: 'root' })
export class SlideFindOneRepositoryImpl implements SlideFindOneRepository {
    private readonly api = inject(SlideFindOneApi);
    private readonly mapper = inject(SlideFindOneMapper);

    execute(filter: SlideFindOneFilterEntity): Observable<SlideFindOneEntity> {
        const paramsDto = slideFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
