import { inject, Injectable } from '@angular/core';
import { PrivacyPolicyDeleteDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-delete.dto';
import { PrivacyPolicyPublishDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-publish.dto';
import { PrivacyPolicyUnpublishDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-unpublish.dto';
import { PrivacyPolicyCreateValidateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-create.validate-contract';
import { PrivacyPolicyUpdateValidateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-update.validate-contract';
import { PrivacyPolicyEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy.entity';
import { PrivacyPolicyRepository } from '@pages/content-management/domain/repositories/privacy-policy/privacy-policy-repository';
import { PrivacyPolicyFilterVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-filter.vo';
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
        filter: PrivacyPolicyFilterVo,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<PrivacyPolicyEntity>> {
        return this.api
            .readAll(privacyPolicyFilterMapper(filter), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        payload: PrivacyPolicyCreateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        return this.api.create(privacyPolicyCreateMapper(payload));
    }

    update(
        payload: PrivacyPolicyUpdateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(privacyPolicyUpdateMapper(payload));
    }

    delete(dto: PrivacyPolicyDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.api.delete(privacyPolicyDeleteMapper(dto));
    }

    publish(dto: PrivacyPolicyPublishDto): Observable<SimpleResponseDto<void>> {
        return this.api.publish(privacyPolicyPublishMapper(dto));
    }

    unpublish(
        dto: PrivacyPolicyUnpublishDto
    ): Observable<SimpleResponseDto<void>> {
        return this.api.unpublish(privacyPolicyUnpublishMapper(dto));
    }
}
