import { inject, Injectable } from '@angular/core';
import { downloadFilterEntity } from '@pages/report-states/domain/entities/download/download-filter.entity';
import { DownloadEntity } from '@pages/report-states/domain/entities/download/download.entity';
import { DownloadRepository } from '@pages/report-states/domain/repositories/download/download.repository';
import { downloadFilterVo } from '@pages/report-states/domain/value-objects/download/download-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { DownloadFilterContract } from '@presentation/pages/report-states/domain/contracts/download/download-filter.contract';

@Injectable({
    providedIn: 'root',
})
export class DownloadUseCase {
    private readonly repository = inject(DownloadRepository);

    execute(
        contract: DownloadFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<DownloadEntity>> {
        const vo = downloadFilterVo(contract);
        const entity = downloadFilterEntity(vo);
        return this.repository.execute(entity, page, options);
    }
}
