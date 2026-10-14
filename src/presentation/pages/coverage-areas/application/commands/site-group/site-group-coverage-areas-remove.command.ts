export class SiteGroupCoverageAreasRemoveCommand {
    constructor(
        public readonly siteGroupId: number,
        public readonly coverageAreaIds: number[]
    ) {}
}
