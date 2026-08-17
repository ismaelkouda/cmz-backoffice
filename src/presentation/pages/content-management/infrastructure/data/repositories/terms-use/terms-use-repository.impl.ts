import { inject, Injectable } from '@angular/core';
import { TermsUseDeleteDto } from '@pages/content-management/application/dto/terms-use/terms-use-delete.dto';
import { TermsUsePublishDto } from '@pages/content-management/application/dto/terms-use/terms-use-publish.dto';
import { TermsUseUnpublishDto } from '@pages/content-management/application/dto/terms-use/terms-use-unpublish.dto';
import { TermsUseCreateValidateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-create.validate-contract';
import { TermsUseUpdateValidateContract } from '@pages/content-management/domain/contracts/terms-use/terms-use-update.validate-contract';
import { TermsUseEntity } from '@pages/content-management/domain/entities/terms-use/terms-use.entity';
import { TermsUseRepository } from '@pages/content-management/domain/repositories/terms-use/terms-use-repository';
import { TermsUseFilterVo } from '@pages/content-management/domain/value-objects/terms-use/terms-use-filter.vo';
import { termsUseCreateMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-create.mapper';
import { termsUseDeleteMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-delete.mapper';
import { termsUseFilterMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-filter.mapper';
import { termsUsePublishMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-publish.mapper';
import { termsUseUnpublishMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-unpublish.mapper';
import { termsUseUpdateMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use-update.mapper';
import { TermsUseMapper } from '@pages/content-management/infrastructure/data/mappers/terms-use/terms-use.mapper';
import { TermsUseApi } from '@pages/content-management/infrastructure/data/sources/terms-use/terms-use.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TermsUseRepositoryImpl implements TermsUseRepository {
    private readonly api = inject(TermsUseApi);
    private readonly mapper = inject(TermsUseMapper);

    readAll(
        filter: TermsUseFilterVo,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TermsUseEntity>> {
        return this.api
            .readAll(termsUseFilterMapper(filter), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        payload: TermsUseCreateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        return this.api.create(termsUseCreateMapper(payload));
    }

    update(
        payload: TermsUseUpdateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(termsUseUpdateMapper(payload));
    }

    delete(dto: TermsUseDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.api.delete(termsUseDeleteMapper(dto));
    }

    publish(dto: TermsUsePublishDto): Observable<SimpleResponseDto<void>> {
        return this.api.publish(termsUsePublishMapper(dto));
    }

    unpublish(dto: TermsUseUnpublishDto): Observable<SimpleResponseDto<void>> {
        return this.api.unpublish(termsUseUnpublishMapper(dto));
    }
}
