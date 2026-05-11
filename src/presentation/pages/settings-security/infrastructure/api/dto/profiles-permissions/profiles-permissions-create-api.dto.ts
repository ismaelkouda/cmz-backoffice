export interface ProfilesPermissionsCreateApiDto {
    name: string;
    description: string;
    permissions?: Record<string, string[]>;
}
