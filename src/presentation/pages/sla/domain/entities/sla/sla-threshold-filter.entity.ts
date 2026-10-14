export class SlaThresholdFilterEntity {
    constructor(
        public readonly slaType?: string,
        public readonly channel?: string
    ) {}
}
