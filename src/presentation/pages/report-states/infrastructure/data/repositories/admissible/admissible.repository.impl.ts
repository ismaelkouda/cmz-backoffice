import { inject, Injectable } from '@angular/core';
import { AdmissibleFilterContract } from '@pages/report-states/domain/contracts/admissible/admissible-filter.contract';
import { AdmissibleEntity } from '@pages/report-states/domain/entities/admissible/admissible.entity';
import { AdmissibleRepository } from '@pages/report-states/domain/repositories/admissible/admissible.repository';
import { AdmissibleFilterMapper } from '@pages/report-states/infrastructure/data/mappers/admissible/admissible-filter.mapper';
import { AdmissibleMapper } from '@pages/report-states/infrastructure/data/mappers/admissible/admissible.mapper';
import { AdmissibleApi } from '@pages/report-states/infrastructure/data/sources/admissible/admissible.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';
import { AdmissibleDownloadEntity } from '@presentation/pages/report-states/domain/entities/admissible/admissible-download.entity';
import { AdmissibleDownloadMapper } from '../../mappers/admissible/admissible-download.mapper';

@Injectable({
    providedIn: 'root',
})
export class AdmissibleRepositoryImpl extends AdmissibleRepository {
    private readonly api = inject(AdmissibleApi);
    private readonly mapper = inject(AdmissibleMapper);
    private readonly filterMapper = inject(AdmissibleFilterMapper);
    private readonly downloadMapper = inject(AdmissibleDownloadMapper);

    execute(
        entity: AdmissibleFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AdmissibleEntity>> {
        return this.api
            .execute(this.filterMapper.map(entity), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    download(entity: AdmissibleDownloadEntity): Observable<MessageResponseDto> {
        return this.api.download(this.downloadMapper.map(entity));
    }
}
