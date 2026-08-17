import { inject, Injectable } from '@angular/core';
import { closeFilterEntity } from '@pages/report-states/domain/entities/close/close-filter.entity';
import { CloseEntity } from '@pages/report-states/domain/entities/close/close.entity';
import { CloseRepository } from '@pages/report-states/domain/repositories/close/close.repository';
import { closeFilterVo } from '@pages/report-states/domain/value-objects/close/close-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { CloseDownloadContract } from '@presentation/pages/report-states/domain/contracts/close/close-download.contract';
import { closeDownloadVo } from '@presentation/pages/report-states/domain/value-objects/close/close-download.vo';
import { closeDownloadFactory } from '@presentation/pages/report-states/domain/factories/close/close-download.factory';
import { CloseFilterContract } from '@presentation/pages/report-states/domain/contracts/close/close-filter.contract';

@Injectable({
    providedIn: 'root',
})
export class CloseUseCase {
    private readonly repository = inject(CloseRepository);

    execute(
        contract: CloseFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<CloseEntity>> {
        const vo = closeFilterVo(contract);
        const entity = closeFilterEntity(vo);
        return this.repository.execute(entity, page, options);
    }

    download(contract: CloseDownloadContract): Observable<MessageResponseDto> {
        const validated = closeDownloadVo(contract);
        const entity = closeDownloadFactory(validated);
        return this.repository.download(entity);
    }
}
