import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { PrivacyPolicyCreateEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-create.entity';
import { PrivacyPolicyDeleteEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-delete.entity';
import { PrivacyPolicyFilterEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-filter.entity';
import { PrivacyPolicyPublishEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-publish.entity';
import { PrivacyPolicyUnpublishEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-unpublish.entity';
import { PrivacyPolicyUpdateEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-update.entity';
import { PrivacyPolicyEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class PrivacyPolicyRepository {
    abstract readAll(
        entity: PrivacyPolicyFilterEntity | null,
        page: string
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
