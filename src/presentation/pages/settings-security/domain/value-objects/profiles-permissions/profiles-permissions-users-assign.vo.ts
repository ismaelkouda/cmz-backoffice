export class ProfilesPermissionsUsersAssignVo {
    private constructor(
        public readonly uniqId: string,
        public readonly users: string[]
    ) {}

    static create(props: {
        uniqId: string;
        users: string[];
    }): ProfilesPermissionsUsersAssignVo {
        const uniqId = props?.uniqId?.trim();
        const users = props?.users?.map((p) => p.trim()) ?? [];

        if (!uniqId) {
            throw new Error('uniqId is required');
        }
        if (!users.length) {
            throw new Error('users required');
        }

        return new ProfilesPermissionsUsersAssignVo(uniqId, users);
    }
}
