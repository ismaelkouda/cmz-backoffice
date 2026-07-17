import { Injectable } from '@angular/core';
import { PrivacyPolicyDeleteDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-delete.dto';
import { PrivacyPolicyPublishDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-publish.dto';
import { PrivacyPolicyUnpublishDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-unpublish.dto';
import { PrivacyPolicyCreateValidateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-create.validate-contract';
import { PrivacyPolicyUpdateValidateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-update.validate-contract';
import { PrivacyPolicyEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy.entity';
import { PrivacyPolicyFilterVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-filter.vo';
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
        filter: PrivacyPolicyFilterVo | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<PrivacyPolicyEntity>>;
    abstract create(
        contract: PrivacyPolicyCreateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        contract: PrivacyPolicyUpdateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract unpublish(
        dto: PrivacyPolicyUnpublishDto
    ): Observable<SimpleResponseDto<void>>;
    abstract publish(
        dto: PrivacyPolicyPublishDto
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        dto: PrivacyPolicyDeleteDto
    ): Observable<SimpleResponseDto<void>>;
}
