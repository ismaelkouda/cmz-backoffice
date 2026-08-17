export interface ProfilesPermissionsCreateDto {
    name: string;
    description: string;
    permissions: Record<string, string[]>;
}
