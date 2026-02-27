import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { LegalNoticeFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-find-one-filter.entity';
import { LegalNoticeFindOneEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-find-one.entity';
import { LegalNoticeFindOneRepository } from '@presentation/pages/content-management/domain/repositories/legal-notice/legal-notice-find-one-repository';
import { legalNoticeFindOneFilterMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/legal-notice/legal-notice-find-one-filter.mapper';
import { LegalNoticeFindOneMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/legal-notice/legal-notice-find-one.mapper';
import { LegalNoticeFindOneApi } from '@presentation/pages/content-management/infrastructure/data/sources/legal-notice/legal-notice-find-one.api';

@Injectable({ providedIn: 'root' })
export class LegalNoticeFindOneRepositoryImpl implements LegalNoticeFindOneRepository {
    private readonly api = inject(LegalNoticeFindOneApi);
    private readonly mapper = inject(LegalNoticeFindOneMapper);

    execute(
        filter: LegalNoticeFindOneFilterEntity
    ): Observable<LegalNoticeFindOneEntity> {
        const paramsDto = legalNoticeFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
