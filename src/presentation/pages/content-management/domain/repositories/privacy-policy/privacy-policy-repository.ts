import { Injectable } from '@angular/core';
import { PrivacyPolicyCreateEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-create.entity';
import { PrivacyPolicyDeleteEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-delete.entity';
import { PrivacyPolicyFilterEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-filter.entity';
import { PrivacyPolicyPublishEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-publish.entity';
import { PrivacyPolicyUnpublishEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-unpublish.entity';
import { PrivacyPolicyUpdateEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-update.entity';
import { PrivacyPolicyEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class PrivacyPolicyRepository {
    abstract readAll(
        entity: PrivacyPolicyFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<PrivacyPolicyEntity>>;
    abstract create(
        entity: PrivacyPolicyCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: PrivacyPolicyUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract unpublish(
        entity: PrivacyPolicyUnpublishEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract publish(
        entity: PrivacyPolicyPublishEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: PrivacyPolicyDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
}
