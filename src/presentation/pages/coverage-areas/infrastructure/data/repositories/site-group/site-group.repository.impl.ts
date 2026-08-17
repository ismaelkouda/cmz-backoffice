import { inject, Injectable } from '@angular/core';
import { SiteGroupCreateValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-create.validate-contract';
import { SiteGroupUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-update.validate-contract';
import { SiteGroupEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group.entity';
import { SiteGroupRepository } from '@pages/coverage-areas/domain/repositories/site-group/site-group.repository';
import { siteGroupCreateMapper } from '@pages/coverage-areas/infrastructure/data/mappers/site-group/site-group-create.mapper';
import { siteGroupDeleteMapper } from '@pages/coverage-areas/infrastructure/data/mappers/site-group/site-group-delete.mapper';
import { siteGroupDisableMapper } from '@pages/coverage-areas/infrastructure/data/mappers/site-group/site-group-disable.mapper';
import { siteGroupEnableMapper } from '@pages/coverage-areas/infrastructure/data/mappers/site-group/site-group-enable.mapper';
import { siteGroupFilterMapper } from '@pages/coverage-areas/infrastructure/data/mappers/site-group/site-group-filter.mapper';
import { siteGroupUpdateMapper } from '@pages/coverage-areas/infrastructure/data/mappers/site-group/site-group-update.mapper';
import { SiteGroupMapper } from '@pages/coverage-areas/infrastructure/data/mappers/site-group/site-group.mapper';
import { SiteGroupApi } from '@pages/coverage-areas/infrastructure/data/sources/site-group/site-group.api';
import {
    Paginate,
    MessageResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';
import { SiteGroupFilterContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-filter.contract';
import { SiteGroupDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-delete.validate-contract';
import { SiteGroupEnableValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-enable.validate-contract';
import { SiteGroupDisableValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-disable.validate-contract';

@Injectable({
    providedIn: 'root',
})
export class SiteGroupRepositoryImpl implements SiteGroupRepository {
    private readonly api = inject(SiteGroupApi);
    private readonly mapper = inject(SiteGroupMapper);

    readAll(
        validContract: SiteGroupFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<SiteGroupEntity>> {
        return this.api
            .readAll(siteGroupFilterMapper(validContract), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        validContract: SiteGroupCreateValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.create(siteGroupCreateMapper(validContract));
    }

    update(
        validContract: SiteGroupUpdateValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.update(siteGroupUpdateMapper(validContract));
    }

    delete(
        validContract: SiteGroupDeleteValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.delete(siteGroupDeleteMapper(validContract));
    }

    enable(
        validContract: SiteGroupEnableValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.enable(siteGroupEnableMapper(validContract));
    }

    disable(
        validContract: SiteGroupDisableValidateContract
    ): Observable<MessageResponseDto> {
        return this.api.disable(siteGroupDisableMapper(validContract));
    }
}
