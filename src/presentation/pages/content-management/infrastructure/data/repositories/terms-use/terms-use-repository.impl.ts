import { inject, Injectable } from '@angular/core';
import { TermsUseCreateEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-create.entity';
import { TermsUseDeleteEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-delete.entity';
import { TermsUseFilterEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-filter.entity';
import { TermsUsePublishEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-publish.entity';
import { TermsUseUnpublishEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-unpublish.entity';
import { TermsUseUpdateEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-update.entity';
import { TermsUseEntity } from '@pages/content-management/domain/entities/terms-use/terms-use.entity';
import { TermsUseRepository } from '@pages/content-management/domain/repositories/terms-use/terms-use-repository';
import { termsUseCreateMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-create.mapper';
import { termsUseDeleteMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-delete.mapper';
import { termsUseFilterMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-filter.mapper';
import { termsUsePublishMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-publish.mapper';
import { termsUseUnpublishMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-unpublish.mapper';
import { termsUseUpdateMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-update.mapper';
import { TermsUseMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use.mapper';
import { TermsUseApi } from '@pages/content-management/infrastructure/data/sources/terms-use/terms-use.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TermsUseRepositoryImpl implements TermsUseRepository {
    private readonly api = inject(TermsUseApi);
    private readonly mapper = inject(TermsUseMapper);

    readAll(
        filter: TermsUseFilterEntity,
        page: string,
        options: FetchOptions
    ): Observable<Paginate<TermsUseEntity>> {
        return this.api
            .readAll(termsUseFilterMapper(filter), page, options)
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
