import { inject, Injectable } from '@angular/core';
import { TermsUseDeleteDto } from '@pages/content-management/application/dto/terms-use/terms-use-delete.dto';
import { TermsUseFilterDto } from '@pages/content-management/application/dto/terms-use/terms-use-filter.dto';
import { TermsUsePublishDto } from '@pages/content-management/application/dto/terms-use/terms-use-publish.dto';
import { TermsUseUnpublishDto } from '@pages/content-management/application/dto/terms-use/terms-use-unpublish.dto';
import { TermsUseCreateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-create.contract';
import { TermsUseUpdateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-update.contract';
import { TermsUseEntity } from '@pages/content-management/domain/entities/terms-use/terms-use.entity';
import { TermsUseRepository } from '@pages/content-management/domain/repositories/terms-use/terms-use-repository';
import { termsUseCreateVo } from '@pages/content-management/domain/value-objects/terms-use/terms-use-create.vo';
import { termsUseDeleteVo } from '@pages/content-management/domain/value-objects/terms-use/terms-use-delete.vo';
import { termsUseFilterVo } from '@pages/content-management/domain/value-objects/terms-use/terms-use-filter.vo';
import { termsUsePublishVo } from '@pages/content-management/domain/value-objects/terms-use/terms-use-publish.vo';
import { termsUseUnpublishVo } from '@pages/content-management/domain/value-objects/terms-use/terms-use-unpublish.vo';
import { termsUseUpdateVo } from '@pages/content-management/domain/value-objects/terms-use/terms-use-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TermsUseUseCase {
    private readonly repository = inject(TermsUseRepository);

    execute(
        dto: TermsUseFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TermsUseEntity>> {
        return this.repository.readAll(termsUseFilterVo(dto), page, options);
    }

    create(dto: TermsUseCreateContract): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.create(termsUseCreateVo(dto)));
    }

    update(dto: TermsUseUpdateContract): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.update(termsUseUpdateVo(dto)));
    }

    publish(dto: TermsUsePublishDto): Observable<SimpleResponseDto<void>> {
        return this.repository.publish(termsUsePublishVo(dto));
    }

    unpublish(dto: TermsUseUnpublishDto): Observable<SimpleResponseDto<void>> {
        return this.repository.unpublish(termsUseUnpublishVo(dto));
    }

    delete(dto: TermsUseDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(termsUseDeleteVo(dto));
    }
}
