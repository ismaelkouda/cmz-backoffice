import { inject, Injectable } from '@angular/core';
import { AllFilterContract } from '@pages/report-states/domain/contracts/all/all-filter.contract';
import { AllEntity } from '@pages/report-states/domain/entities/all/all.entity';
import { AllRepository } from '@pages/report-states/domain/repositories/all/all.repository';
import { AllFilterMapper } from '@pages/report-states/infrastructure/data/mappers/all/all-filter.mapper';
import { AllMapper } from '@pages/report-states/infrastructure/data/mappers/all/all.mapper';
import { AllApi } from '@pages/report-states/infrastructure/data/sources/all/all.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';
import { AllDownloadEntity } from '@presentation/pages/report-states/domain/entities/all/all-download.entity';
import { AllDownloadMapper } from '../../mappers/all/all-download.mapper';
import { StatsDto as AllStatsDto } from '@pages/report-states/infrastructure/api/dto/all/all-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class AllRepositoryImpl extends AllRepository {
    private readonly api = inject(AllApi);
    private readonly mapper = inject(AllMapper);
    private readonly filterMapper = inject(AllFilterMapper);
    private readonly downloadMapper = inject(AllDownloadMapper);

    execute(
        entity: AllFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AllEntity, AllStatsDto>> {
        return this.api
            .execute(this.filterMapper.map(entity), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    download(entity: AllDownloadEntity): Observable<MessageResponseDto> {
        return this.api.download(this.downloadMapper.map(entity));
    }
}
