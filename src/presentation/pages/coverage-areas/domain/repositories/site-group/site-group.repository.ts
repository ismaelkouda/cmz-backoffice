import { Injectable } from '@angular/core';
import { SiteGroupCreateValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-create.validate-contract';
import { SiteGroupDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-delete.validate-contract';
import { SiteGroupDisableValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-disable.validate-contract';
import { SiteGroupEnableValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-enable.validate-contract';
import { SiteGroupFilterContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-filter.contract';
import { SiteGroupUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-update.validate-contract';
import { SiteGroupEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group.entity';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class SiteGroupRepository {
    abstract readAll(
        dto: SiteGroupFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<SiteGroupEntity>>;
    abstract create(
        contract: SiteGroupCreateValidateContract
    ): Observable<MessageResponseDto>;
    abstract update(
        contract: SiteGroupUpdateValidateContract
    ): Observable<MessageResponseDto>;
    abstract delete(
        dto: SiteGroupDeleteValidateContract
    ): Observable<MessageResponseDto>;
    abstract enable(
        dto: SiteGroupEnableValidateContract
    ): Observable<MessageResponseDto>;
    abstract disable(
        dto: SiteGroupDisableValidateContract
    ): Observable<MessageResponseDto>;
}
