import { inject, Injectable } from '@angular/core';
import { TermsUseFindOneFilterEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-find-one-filter.entity';
import { TermsUseFindOneEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-find-one.entity';
import { TermsUseFindOneRepository } from '@pages/content-management/domain/repositories/terms-use/terms-use-find-one-repository';
import { termsUseFindOneFilterMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-find-one-filter.mapper';
import { TermsUseFindOneMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-find-one.mapper';
import { TermsUseFindOneApi } from '@pages/content-management/infrastructure/data/sources/terms-use/terms-use-find-one.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TermsUseFindOneRepositoryImpl implements TermsUseFindOneRepository {
    private readonly api = inject(TermsUseFindOneApi);
    private readonly mapper = inject(TermsUseFindOneMapper);

    execute(
        filter: TermsUseFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<TermsUseFindOneEntity> {
        const paramsDto = termsUseFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
