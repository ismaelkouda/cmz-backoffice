export interface ProfilesAuthorizationsDetailsResponseInterface {
    error: boolean;
    message: string;
    data: ProfilesAuthorizationsDetailsInterface;
}

export interface ProfilesAuthorizationsDetailsInterface {
    id: number;
    nom: string;
    slug: string;
    description: string;
    statut: string;
    permissions: PermissionNodeInterface[];
    created_at: string;
    updated_at: string;
}

export interface PermissionNodeInterface {
    data: PermissionDataInterface;
    children?: PermissionNodeInterface[];
}

export interface PermissionDataInterface {
    title: string;
    value: string;
    checked: boolean;
}
