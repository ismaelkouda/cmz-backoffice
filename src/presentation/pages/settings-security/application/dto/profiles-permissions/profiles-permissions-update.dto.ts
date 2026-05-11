export interface ProfilesPermissionsUpdateDto {
    uniqId: string;
    name: string;
    description: string;
    permissions: Record<string, string[]>;
}
