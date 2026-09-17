import { inject, Injectable } from '@angular/core';
import { admissibleFilterEntity } from '@pages/report-states/domain/entities/admissible/admissible-filter.entity';
import { AdmissibleEntity } from '@pages/report-states/domain/entities/admissible/admissible.entity';
import { AdmissibleRepository } from '@pages/report-states/domain/repositories/admissible/admissible.repository';
import { admissibleFilterVo } from '@pages/report-states/domain/value-objects/admissible/admissible-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { AdmissibleDownloadContract } from '@presentation/pages/report-states/domain/contracts/admissible/admissible-download.contract';
import { admissibleDownloadVo } from '@presentation/pages/report-states/domain/value-objects/admissible/admissible-download.vo';
import { admissibleDownloadFactory } from '@presentation/pages/report-states/domain/factories/admissible/admissible-download.factory';
import { AdmissibleFilterContract } from '@presentation/pages/report-states/domain/contracts/admissible/admissible-filter.contract';

@Injectable({
    providedIn: 'root',
})
export class AdmissibleUseCase {
    private readonly repository = inject(AdmissibleRepository);

    execute(
        contract: AdmissibleFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AdmissibleEntity>> {
        const vo = admissibleFilterVo(contract);
        const entity = admissibleFilterEntity(vo);
        return this.repository.execute(entity, page, options);
    }

    download(
        contract: AdmissibleDownloadContract
    ): Observable<MessageResponseDto> {
        const validated = admissibleDownloadVo(contract);
        const entity = admissibleDownloadFactory(validated);
        return this.repository.download(entity);
    }
}
