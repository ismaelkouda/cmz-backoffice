import { inject, Injectable } from '@angular/core';
import { evaluateFilterEntity } from '@pages/report-states/domain/entities/evaluate/evaluate-filter.entity';
import { EvaluateEntity } from '@pages/report-states/domain/entities/evaluate/evaluate.entity';
import { EvaluateRepository } from '@pages/report-states/domain/repositories/evaluate/evaluate.repository';
import { evaluateFilterVo } from '@pages/report-states/domain/value-objects/evaluate/evaluate-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { EvaluateDownloadContract } from '@presentation/pages/report-states/domain/contracts/evaluate/evaluate-download.contract';
import { evaluateDownloadVo } from '@presentation/pages/report-states/domain/value-objects/evaluate/evaluate-download.vo';
import { evaluateDownloadFactory } from '@presentation/pages/report-states/domain/factories/evaluate/evaluate-download.factory';
import { EvaluateFilterContract } from '@presentation/pages/report-states/domain/contracts/evaluate/evaluate-filter.contract';

@Injectable({
    providedIn: 'root',
})
export class EvaluateUseCase {
    private readonly repository = inject(EvaluateRepository);

    execute(
        contract: EvaluateFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<EvaluateEntity>> {
        const vo = evaluateFilterVo(contract);
        const entity = evaluateFilterEntity(vo);
        return this.repository.execute(entity, page, options);
    }

    download(
        contract: EvaluateDownloadContract
    ): Observable<SimpleResponseDto<void>> {
        const validated = evaluateDownloadVo(contract);
        const entity = evaluateDownloadFactory(validated);
        return this.repository.download(entity);
    }
}
