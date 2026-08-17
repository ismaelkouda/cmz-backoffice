export class MobileNetworkCreateCommand {
    constructor(
        public readonly siteId: string | undefined,
        public readonly siteName: string | undefined,
        public readonly siteGroupId: string | number | undefined,
        public readonly towerTypeId: string | number | undefined,
        public readonly towerHeight: string | undefined,
        public readonly networkTechnology: string | undefined,
        public readonly operator: string | undefined,
        public readonly coverageRadius: number | undefined
    ) {}
}
