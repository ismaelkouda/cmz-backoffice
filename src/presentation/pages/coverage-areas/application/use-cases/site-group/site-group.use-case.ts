import { inject, Injectable } from '@angular/core';
import { SiteGroupEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group.entity';
import { SiteGroupCreateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-create.contract';
import { SiteGroupUpdateContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-update.contract';
import { SiteGroupRepository } from '@pages/coverage-areas/domain/repositories/site-group/site-group.repository';
import { siteGroupCreateVo } from '@pages/coverage-areas/domain/value-objects/site-group/site-group-create.vo';
import { siteGroupDeleteVo } from '@pages/coverage-areas/domain/value-objects/site-group/site-group-delete.vo';
import { siteGroupDisableVo } from '@pages/coverage-areas/domain/value-objects/site-group/site-group-disable.vo';
import { siteGroupEnableVo } from '@pages/coverage-areas/domain/value-objects/site-group/site-group-enable.vo';
import { siteGroupFilterVo } from '@pages/coverage-areas/domain/value-objects/site-group/site-group-filter.vo';
import { siteGroupUpdateVo } from '@pages/coverage-areas/domain/value-objects/site-group/site-group-update.vo';
import { SiteGroupFilterContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-filter.contract';
import {
    Paginate,
    MessageResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';
import { SiteGroupDeleteContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-delete.contract';
import { SiteGroupEnableContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-enable.contract';
import { SiteGroupDisableContract } from '@pages/coverage-areas/domain/contracts/site-group/site-group-disable.contract';
import { siteGroupFilterEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-filter.entity';

@Injectable({
    providedIn: 'root',
})
export class SiteGroupUseCase {
    private readonly repository = inject(SiteGroupRepository);

    execute(
        contract: SiteGroupFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<SiteGroupEntity>> {
        return defer(() => {
            const vo = siteGroupFilterVo(contract);
            const entity = siteGroupFilterEntity(vo);
            return this.repository.readAll(entity, page, options);
        });
    }

    create(contract: SiteGroupCreateContract): Observable<MessageResponseDto> {
        return defer(() => this.repository.create(siteGroupCreateVo(contract)));
    }

    update(contract: SiteGroupUpdateContract): Observable<MessageResponseDto> {
        return defer(() => this.repository.update(siteGroupUpdateVo(contract)));
    }

    delete(contract: SiteGroupDeleteContract): Observable<MessageResponseDto> {
        return defer(() => this.repository.delete(siteGroupDeleteVo(contract)));
    }

    enable(contract: SiteGroupEnableContract): Observable<MessageResponseDto> {
        return defer(() => this.repository.enable(siteGroupEnableVo(contract)));
    }

    disable(
        contract: SiteGroupDisableContract
    ): Observable<MessageResponseDto> {
        return defer(() =>
            this.repository.disable(siteGroupDisableVo(contract))
        );
    }
}
