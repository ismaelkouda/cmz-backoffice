interface UserPermissions {
    id: number;
    level: number;
    title: string;
    label: string;
    code: string;
    headCode: string;
    icon: string;
    path?: string;
    type: string;
    active?: boolean;
    expanded?: boolean;
    statut?: boolean;
    children?: UserPermissions[];
}

export interface CurrentUser {
    id: number;
    last_name: string;
    first_name: string;
    email: string;
    profile: string;
    phone: string;
    is_admin: boolean;
    status: string;
    photo: string;
    permissions: UserPermissions[];
    paths: string[];
}

export interface AuthToken {
    value: string;
    expiresAt: string;
}
