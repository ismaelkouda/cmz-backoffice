import { AdmissibleFilterContract } from '@pages/report-states/domain/contracts/admissible/admissible-filter.contract';
import { AdmissibleEntity } from '@pages/report-states/domain/entities/admissible/admissible.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { AdmissibleDownloadEntity } from '@presentation/pages/report-states/domain/entities/admissible/admissible-download.entity';

export abstract class AdmissibleRepository {
    abstract execute(
        entity: AdmissibleFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<AdmissibleEntity>>;

    abstract download(
        entity: AdmissibleDownloadEntity
    ): Observable<MessageResponseDto>;
}
