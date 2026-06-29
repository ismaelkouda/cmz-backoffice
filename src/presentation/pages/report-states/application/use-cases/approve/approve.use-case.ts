import { inject, Injectable } from '@angular/core';
import { approveFilterEntity } from '@pages/report-states/domain/entities/approve/approve-filter.entity';
import { ApproveEntity } from '@pages/report-states/domain/entities/approve/approve.entity';
import { ApproveRepository } from '@pages/report-states/domain/repositories/approve/approve.repository';
import { approveFilterVo } from '@pages/report-states/domain/value-objects/approve/approve-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { ApproveDownloadContract } from '@presentation/pages/report-states/domain/contracts/approve/approve-download.contract';
import { approveDownloadVo } from '@presentation/pages/report-states/domain/value-objects/approve/approve-download.vo';
import { approveDownloadFactory } from '@presentation/pages/report-states/domain/factories/approve/approve-download.factory';
import { ApproveFilterContract } from '@presentation/pages/report-states/domain/contracts/approve/approve-filter.contract';

@Injectable({
    providedIn: 'root',
})
export class ApproveUseCase {
    private readonly repository = inject(ApproveRepository);

    execute(
        contract: ApproveFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ApproveEntity>> {
        const vo = approveFilterVo(contract);
        const entity = approveFilterEntity(vo);
        return this.repository.execute(entity, page, options);
    }

    download(
        contract: ApproveDownloadContract
    ): Observable<SimpleResponseDto<void>> {
        const validated = approveDownloadVo(contract);
        const entity = approveDownloadFactory(validated);
        return this.repository.download(entity);
    }
}
