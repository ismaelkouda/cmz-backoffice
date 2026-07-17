import { inject, Injectable } from '@angular/core';
import { PrivacyPolicyDeleteDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-delete.dto';
import { PrivacyPolicyFilterDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-filter.dto';
import { PrivacyPolicyPublishDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-publish.dto';
import { PrivacyPolicyUnpublishDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-unpublish.dto';
import { PrivacyPolicyCreateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-create.contract';
import { PrivacyPolicyUpdateContract } from '@pages/content-management/domain/contracts/privacy-policy/privacy-policy-update.contract';
import { PrivacyPolicyEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy.entity';
import { PrivacyPolicyRepository } from '@pages/content-management/domain/repositories/privacy-policy/privacy-policy-repository';
import { privacyPolicyCreateVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-create.vo';
import { privacyPolicyDeleteVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-delete.vo';
import { privacyPolicyFilterVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-filter.vo';
import { privacyPolicyPublishVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-publish.vo';
import { privacyPolicyUnpublishVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-unpublish.vo';
import { privacyPolicyUpdateVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyUseCase {
    private readonly repository = inject(PrivacyPolicyRepository);

    execute(
        dto: PrivacyPolicyFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<PrivacyPolicyEntity>> {
        return this.repository.readAll(
            privacyPolicyFilterVo(dto),
            page,
            options
        );
    }

    create(
        dto: PrivacyPolicyCreateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.create(privacyPolicyCreateVo(dto)));
    }

    update(
        dto: PrivacyPolicyUpdateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.update(privacyPolicyUpdateVo(dto)));
    }

    publish(dto: PrivacyPolicyPublishDto): Observable<SimpleResponseDto<void>> {
        return this.repository.publish(privacyPolicyPublishVo(dto));
    }

    unpublish(
        dto: PrivacyPolicyUnpublishDto
    ): Observable<SimpleResponseDto<void>> {
        return this.repository.unpublish(privacyPolicyUnpublishVo(dto));
    }

    delete(dto: PrivacyPolicyDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(privacyPolicyDeleteVo(dto));
    }
}
