import { inject, Injectable } from '@angular/core';
import { rejectFilterEntity } from '@pages/report-states/domain/entities/reject/reject-filter.entity';
import { RejectEntity } from '@pages/report-states/domain/entities/reject/reject.entity';
import { RejectRepository } from '@pages/report-states/domain/repositories/reject/reject.repository';
import { rejectFilterVo } from '@pages/report-states/domain/value-objects/reject/reject-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { RejectDownloadContract } from '@presentation/pages/report-states/domain/contracts/reject/reject-download.contract';
import { rejectDownloadVo } from '@presentation/pages/report-states/domain/value-objects/reject/reject-download.vo';
import { rejectDownloadFactory } from '@presentation/pages/report-states/domain/factories/reject/reject-download.factory';
import { RejectFilterContract } from '@presentation/pages/report-states/domain/contracts/reject/reject-filter.contract';

@Injectable({
    providedIn: 'root',
})
export class RejectUseCase {
    private readonly repository = inject(RejectRepository);

    execute(
        contract: RejectFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RejectEntity>> {
        const vo = rejectFilterVo(contract);
        const entity = rejectFilterEntity(vo);
        return this.repository.execute(entity, page, options);
    }

    download(
        contract: RejectDownloadContract
    ): Observable<SimpleResponseDto<void>> {
        const validated = rejectDownloadVo(contract);
        const entity = rejectDownloadFactory(validated);
        return this.repository.download(entity);
    }
}
