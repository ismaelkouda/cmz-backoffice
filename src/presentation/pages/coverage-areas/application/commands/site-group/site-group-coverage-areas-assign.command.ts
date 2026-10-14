export class SiteGroupCoverageAreasAssignCommand {
    constructor(
        public readonly siteGroupId: number,
        public readonly coverageAreaIds: number[]
    ) {}
}
