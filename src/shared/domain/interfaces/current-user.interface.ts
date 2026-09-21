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
    enable2fa: boolean;
    two_fa?: {
        enabled: boolean;
        channel: 'email' | 'sms';
    };
    status: string;
    photo: string;
    permissions: UserPermissions[];
    paths: string[];
    actions: Record<string, string[]> | null;
    privacy: {
        accepted_at: string | null;
        content: string | null;
    };
}

export interface AuthToken {
    value: string;
    expiresAt: string;
}
