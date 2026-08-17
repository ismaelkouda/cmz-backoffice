import { Injectable } from '@angular/core';
import { TermsUseDeleteDto } from '@pages/content-management/application/dto/terms-use/terms-use-delete.dto';
import { TermsUsePublishDto } from '@pages/content-management/application/dto/terms-use/terms-use-publish.dto';
import { TermsUseUnpublishDto } from '@pages/content-management/application/dto/terms-use/terms-use-unpublish.dto';
import { TermsUseCreateValidateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-create.validate-contract';
import { TermsUseUpdateValidateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-update.validate-contract';
import { TermsUseEntity } from '@pages/content-management/domain/entities/terms-use/terms-use.entity';
import { TermsUseFilterVo } from '@pages/content-management/domain/value-objects/terms-use/terms-use-filter.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class TermsUseRepository {
    abstract readAll(
        filter: TermsUseFilterVo | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TermsUseEntity>>;
    abstract create(
        contract: TermsUseCreateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        contract: TermsUseUpdateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        dto: TermsUseDeleteDto
    ): Observable<SimpleResponseDto<void>>;
    abstract publish(
        dto: TermsUsePublishDto
    ): Observable<SimpleResponseDto<void>>;
    abstract unpublish(
        dto: TermsUseUnpublishDto
    ): Observable<SimpleResponseDto<void>>;
}
