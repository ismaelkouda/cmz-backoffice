import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { TermsUseCreateEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-create.entity';
import { TermsUseDeleteEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-delete.entity';
import { TermsUseFilterEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-filter.entity';
import { TermsUsePublishEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-publish.entity';
import { TermsUseUnpublishEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-unpublish.entity';
import { TermsUseUpdateEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-update.entity';
import { TermsUseEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use.entity';
import { TermsUseRepository } from '@presentation/pages/content-management/domain/repositories/terms-use/terms-use-repository';
import { termsUseCreateMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/terms-use/terms-use-create.mapper';
import { termsUseDeleteMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/terms-use/terms-use-delete.mapper';
import { termsUseFilterMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/terms-use/terms-use-filter.mapper';
import { termsUsePublishMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/terms-use/terms-use-publish.mapper';
import { termsUseUnpublishMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/terms-use/terms-use-unpublish.mapper';
import { termsUseUpdateMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/terms-use/terms-use-update.mapper';
import { TermsUseMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/terms-use/terms-use.mapper';
import { TermsUseApi } from '@presentation/pages/content-management/infrastructure/data/sources/terms-use/terms-use.api';

@Injectable({
    providedIn: 'root',
})
export class TermsUseRepositoryImpl implements TermsUseRepository {
    private readonly api = inject(TermsUseApi);
    private readonly mapper = inject(TermsUseMapper);

    readAll(
        filter: TermsUseFilterEntity,
        page: string
    ): Observable<Paginate<TermsUseEntity>> {
        return this.api
            .readAll(termsUseFilterMapper(filter), page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: TermsUseCreateEntity): Observable<SimpleResponseDto<void>> {
        return this.api.create(termsUseCreateMapper(payload));
    }

    update(payload: TermsUseUpdateEntity): Observable<SimpleResponseDto<void>> {
        return this.api.update(termsUseUpdateMapper(payload));
    }

    delete(entity: TermsUseDeleteEntity): Observable<SimpleResponseDto<void>> {
        return this.api.delete(termsUseDeleteMapper(entity));
    }

    publish(
        entity: TermsUsePublishEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.publish(termsUsePublishMapper(entity));
    }

    unpublish(
        entity: TermsUseUnpublishEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.unpublish(termsUseUnpublishMapper(entity));
    }
}
