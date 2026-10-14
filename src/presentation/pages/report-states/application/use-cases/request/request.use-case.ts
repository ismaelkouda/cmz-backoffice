import { inject, Injectable } from '@angular/core';
import { requestFilterEntity } from '@pages/report-states/domain/entities/request/request-filter.entity';
import { RequestEntity } from '@pages/report-states/domain/entities/request/request.entity';
import { RequestRepository } from '@pages/report-states/domain/repositories/request/request.repository';
import { requestFilterVo } from '@pages/report-states/domain/value-objects/request/request-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { RequestDownloadContract } from '@presentation/pages/report-states/domain/contracts/request/request-download.contract';
import { requestDownloadVo } from '@presentation/pages/report-states/domain/value-objects/request/request-download.vo';
import { requestDownloadFactory } from '@presentation/pages/report-states/domain/factories/request/request-download.factory';
import { RequestFilterContract } from '@presentation/pages/report-states/domain/contracts/request/request-filter.contract';

@Injectable({
    providedIn: 'root',
})
export class RequestUseCase {
    private readonly repository = inject(RequestRepository);

    execute(
        contract: RequestFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<RequestEntity>> {
        const vo = requestFilterVo(contract);
        const entity = requestFilterEntity(vo);
        return this.repository.execute(entity, page, options);
    }

    download(
        contract: RequestDownloadContract
    ): Observable<MessageResponseDto> {
        const validated = requestDownloadVo(contract);
        const entity = requestDownloadFactory(validated);
        return this.repository.download(entity);
    }
}
