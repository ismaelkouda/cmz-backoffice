export class TeamsTreeNodeEntity {
    constructor(
        public readonly key: string,
        public readonly label: string,
        public readonly checked: boolean,
        public readonly children: TeamsTreeNodeEntity[]
    ) {}
}
