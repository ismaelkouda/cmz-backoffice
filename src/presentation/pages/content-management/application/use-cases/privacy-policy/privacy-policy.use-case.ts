import { inject, Injectable } from '@angular/core';
import { PrivacyPolicyCreateDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-create.dto';
import { PrivacyPolicyDeleteDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-delete.dto';
import { PrivacyPolicyFilterDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-filter.dto';
import { PrivacyPolicyPublishDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-publish.dto';
import { PrivacyPolicyUnpublishDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-unpublish.dto';
import { PrivacyPolicyUpdateDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-update.dto';
import { PrivacyPolicyCreateEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-create.entity';
import { PrivacyPolicyDeleteEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-delete.entity';
import { PrivacyPolicyFilterEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-filter.entity';
import { PrivacyPolicyPublishEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-publish.entity';
import { PrivacyPolicyUnpublishEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-unpublish.entity';
import { PrivacyPolicyUpdateEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-update.entity';
import { PrivacyPolicyEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy.entity';
import { PrivacyPolicyRepository } from '@pages/content-management/domain/repositories/privacy-policy/privacy-policy-repository';
import { PrivacyPolicyCreateVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-create.vo';
import { PrivacyPolicyDeleteVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-delete.vo';
import { PrivacyPolicyFilterVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-filter.vo';
import { PrivacyPolicyPublishVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-publish.vo';
import { PrivacyPolicyUnpublishVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-unpublish.vo';
import { PrivacyPolicyUpdateVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

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
        const vo = PrivacyPolicyFilterVo.fromDto(dto);
        const entity = PrivacyPolicyFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page, options);
    }

    create(dto: PrivacyPolicyCreateDto): Observable<SimpleResponseDto<void>> {
        const vo = PrivacyPolicyCreateVo.fromDto(dto);
        const entity = PrivacyPolicyCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(dto: PrivacyPolicyUpdateDto): Observable<SimpleResponseDto<void>> {
        const vo = PrivacyPolicyUpdateVo.fromDto(dto);
        const entity = PrivacyPolicyUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    publish(dto: PrivacyPolicyPublishDto): Observable<SimpleResponseDto<void>> {
        const vo = PrivacyPolicyPublishVo.fromDto(dto);
        const entity = PrivacyPolicyPublishEntity.fromVo(vo);
        return this.repository.publish(entity);
    }

    unpublish(
        dto: PrivacyPolicyUnpublishDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = PrivacyPolicyUnpublishVo.fromDto(dto);
        const entity = PrivacyPolicyUnpublishEntity.fromVo(vo);
        return this.repository.unpublish(entity);
    }

    delete(dto: PrivacyPolicyDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = PrivacyPolicyDeleteVo.fromDto(dto);
        const entity = PrivacyPolicyDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
