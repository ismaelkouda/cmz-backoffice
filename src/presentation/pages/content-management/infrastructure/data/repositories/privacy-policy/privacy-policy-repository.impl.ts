import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

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
import { PrivacyPolicyRepository } from '@presentation/pages/content-management/domain/repositories/privacy-policy/privacy-policy-repository';
import { privacyPolicyCreateMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-create.mapper';
import { privacyPolicyDeleteMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-delete.mapper';
import { privacyPolicyFilterMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-filter.mapper';
import { privacyPolicyPublishMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-publish.mapper';
import { privacyPolicyUnpublishMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-unpublish.mapper';
import { privacyPolicyUpdateMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-update.mapper';
import { PrivacyPolicyMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy.mapper';
import { PrivacyPolicyApi } from '@presentation/pages/content-management/infrastructure/data/sources/privacy-policy/privacy-policy.api';

@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyRepositoryImpl implements PrivacyPolicyRepository {
    private readonly api = inject(PrivacyPolicyApi);
    private readonly mapper = inject(PrivacyPolicyMapper);

    readAll(
        filter: PrivacyPolicyFilterEntity,
        page: string
    ): Observable<Paginate<PrivacyPolicyEntity>> {
        return this.api
            .readAll(privacyPolicyFilterMapper(filter), page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        payload: PrivacyPolicyCreateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.create(privacyPolicyCreateMapper(payload));
    }

    update(
        payload: PrivacyPolicyUpdateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(privacyPolicyUpdateMapper(payload));
    }

    delete(
        entity: PrivacyPolicyDeleteEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.delete(privacyPolicyDeleteMapper(entity));
    }

    publish(
        entity: PrivacyPolicyPublishEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.publish(privacyPolicyPublishMapper(entity));
    }

    unpublish(
        entity: PrivacyPolicyUnpublishEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.unpublish(privacyPolicyUnpublishMapper(entity));
    }
}
