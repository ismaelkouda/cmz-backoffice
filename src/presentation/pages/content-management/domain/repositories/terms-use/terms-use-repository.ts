import { Injectable } from '@angular/core';
import { TermsUseCreateEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-create.entity';
import { TermsUseDeleteEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-delete.entity';
import { TermsUseFilterEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-filter.entity';
import { TermsUsePublishEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-publish.entity';
import { TermsUseUnpublishEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-unpublish.entity';
import { TermsUseUpdateEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-update.entity';
import { TermsUseEntity } from '@pages/content-management/domain/entities/terms-use/terms-use.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
