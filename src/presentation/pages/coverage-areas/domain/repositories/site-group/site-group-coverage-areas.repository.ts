import { SiteGroupCoverageAreasEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-coverage-areas.entity';
import { SiteGroupCoverageAreaSelectionEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-coverage-area-selection.entity';
import { SiteGroupCoverageAreaIds } from '@pages/coverage-areas/domain/interfaces/site-group/site-group-coverage-area-ids.interface';
import { SiteGroupCoverageAreaReassign } from '@pages/coverage-areas/domain/interfaces/site-group/site-group-coverage-area-reassign.interface';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class SiteGroupCoverageAreasRepository {
    abstract read(
        siteGroupId: number,
        options?: FetchOptions
    ): Observable<SiteGroupCoverageAreasEntity>;

    abstract readUnassigned(
        options?: FetchOptions
    ): Observable<SiteGroupCoverageAreaSelectionEntity[]>;

    abstract assign(
        siteGroupId: number,
        dto: SiteGroupCoverageAreaIds
    ): Observable<MessageResponseDto>;

    abstract reassign(
        siteGroupId: number,
        dto: SiteGroupCoverageAreaReassign
    ): Observable<MessageResponseDto>;

    abstract remove(
        siteGroupId: number,
        dto: SiteGroupCoverageAreaIds
    ): Observable<MessageResponseDto>;
}
