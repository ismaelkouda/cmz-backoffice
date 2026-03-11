import { inject, Injectable } from '@angular/core';
import { LegalNoticeFindOneFilterEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-find-one-filter.entity';
import { LegalNoticeFindOneEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-find-one.entity';
import { LegalNoticeFindOneRepository } from '@pages/content-management/domain/repositories/legal-notice/legal-notice-find-one-repository';
import { legalNoticeFindOneFilterMapper } from '@pages/content-management/infrastructure/data/mappers/legal-notice/legal-notice-find-one-filter.mapper';
import { LegalNoticeFindOneMapper } from '@pages/content-management/infrastructure/data/mappers/legal-notice/legal-notice-find-one.mapper';
import { LegalNoticeFindOneApi } from '@pages/content-management/infrastructure/data/sources/legal-notice/legal-notice-find-one.api';
import { map, Observable } from 'rxjs';

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
