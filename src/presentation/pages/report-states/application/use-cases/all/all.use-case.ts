import { inject, Injectable } from '@angular/core';
import { allFilterEntity } from '@pages/report-states/domain/entities/all/all-filter.entity';
import { AllEntity } from '@pages/report-states/domain/entities/all/all.entity';
import { AllRepository } from '@pages/report-states/domain/repositories/all/all.repository';
import { allFilterVo } from '@pages/report-states/domain/value-objects/all/all-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { AllDownloadContract } from '@presentation/pages/report-states/domain/contracts/all/all-download.contract';
import { allDownloadVo } from '@presentation/pages/report-states/domain/value-objects/all/all-download.vo';
import { allDownloadFactory } from '@presentation/pages/report-states/domain/factories/all/all-download.factory';
import { AllFilterContract } from '@presentation/pages/report-states/domain/contracts/all/all-filter.contract';
import { StatsDto as AllStatsDto } from '@pages/report-states/infrastructure/api/dto/all/all-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class AllUseCase {
    private readonly repository = inject(AllRepository);

    execute(
        contract: AllFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AllEntity, AllStatsDto>> {
        const vo = allFilterVo(contract);
        const entity = allFilterEntity(vo);
        return this.repository.execute(entity, page, options);
    }

    download(contract: AllDownloadContract): Observable<MessageResponseDto> {
        const validated = allDownloadVo(contract);
        const entity = allDownloadFactory(validated);
        return this.repository.download(entity);
    }
}
