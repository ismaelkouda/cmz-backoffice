export class SiteGroupCoverageAreasReassignCommand {
    constructor(
        public readonly siteGroupId: number,
        public readonly coverageAreaIds: number[],
        public readonly targetSiteGroupId: number
    ) {}
}
