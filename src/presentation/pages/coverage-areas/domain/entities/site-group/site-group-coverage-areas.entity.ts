import { SiteGroupCoverageAreasProps } from '@pages/coverage-areas/domain/interfaces/site-group/site-group-coverage-areas-props.interface';
import { SiteGroupCoverageAreaEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group-coverage-area.entity';

export class SiteGroupCoverageAreasEntity {
    constructor(private readonly props: SiteGroupCoverageAreasProps) {}

    get coverageAreas(): SiteGroupCoverageAreaEntity[] {
        return this.props.coverageAreas;
    }
}
