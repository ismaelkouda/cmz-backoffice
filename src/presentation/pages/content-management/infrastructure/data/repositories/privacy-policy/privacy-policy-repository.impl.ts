import { inject, Injectable } from '@angular/core';
import { PrivacyPolicyCreateEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-create.entity';
import { PrivacyPolicyDeleteEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-delete.entity';
import { PrivacyPolicyFilterEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-filter.entity';
import { PrivacyPolicyPublishEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-publish.entity';
import { PrivacyPolicyUnpublishEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-unpublish.entity';
import { PrivacyPolicyUpdateEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-update.entity';
import { PrivacyPolicyEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy.entity';
import { PrivacyPolicyRepository } from '@pages/content-management/domain/repositories/privacy-policy/privacy-policy-repository';
import { privacyPolicyCreateMapper } from '@pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-create.mapper';
import { privacyPolicyDeleteMapper } from '@pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-delete.mapper';
import { privacyPolicyFilterMapper } from '@pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-filter.mapper';
import { privacyPolicyPublishMapper } from '@pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-publish.mapper';
import { privacyPolicyUnpublishMapper } from '@pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-unpublish.mapper';
import { privacyPolicyUpdateMapper } from '@pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-update.mapper';
import { PrivacyPolicyMapper } from '@pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy.mapper';
import { PrivacyPolicyApi } from '@pages/content-management/infrastructure/data/sources/privacy-policy/privacy-policy.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyRepositoryImpl implements PrivacyPolicyRepository {
    private readonly api = inject(PrivacyPolicyApi);
    private readonly mapper = inject(PrivacyPolicyMapper);

    readAll(
        filter: PrivacyPolicyFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<PrivacyPolicyEntity>> {
        return this.api
            .readAll(privacyPolicyFilterMapper(filter), page, options)
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
