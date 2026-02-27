import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { TermsUseFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-find-one-filter.entity';
import { TermsUseFindOneEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-find-one.entity';
import { TermsUseFindOneRepository } from '@presentation/pages/content-management/domain/repositories/terms-use/terms-use-find-one-repository';
import { termsUseFindOneFilterMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/terms-use/terms-use-find-one-filter.mapper';
import { TermsUseFindOneMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/terms-use/terms-use-find-one.mapper';
import { TermsUseFindOneApi } from '@presentation/pages/content-management/infrastructure/data/sources/terms-use/terms-use-find-one.api';

@Injectable({ providedIn: 'root' })
export class TermsUseFindOneRepositoryImpl implements TermsUseFindOneRepository {
    private readonly api = inject(TermsUseFindOneApi);
    private readonly mapper = inject(TermsUseFindOneMapper);

    execute(
        filter: TermsUseFindOneFilterEntity
    ): Observable<TermsUseFindOneEntity> {
        const paramsDto = termsUseFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
