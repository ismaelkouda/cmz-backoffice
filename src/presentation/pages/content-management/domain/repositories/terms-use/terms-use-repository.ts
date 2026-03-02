import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

@Injectable({
    providedIn: 'root',
})
export abstract class TermsUseRepository {
    abstract readAll(
        entity: TermsUseFilterEntity | null,
        page: string
    ): Observable<Paginate<TermsUseEntity>>;
    abstract create(
        entity: TermsUseCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: TermsUseUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: TermsUseDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract publish(
        entity: TermsUsePublishEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract unpublish(
        entity: TermsUseUnpublishEntity
    ): Observable<SimpleResponseDto<void>>;
}
