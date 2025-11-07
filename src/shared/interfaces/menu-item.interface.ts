export interface MenuItem {
    id: number;
    level: number;
    title: string;
    label: string;
    code: string;
    headCode?: string;
    icon?: string;
    path?: string;
    type: 'link' | 'sub';
    active?: boolean;
    expanded?: boolean;
    statut?: boolean;
    children?: MenuItemChildren[];
}

export interface MenuItemChildren {
    path: string;
    title: string;
    label: string;
    code: string;
    type: 'link' | 'sub';
    active?: boolean;
    children?: MenuItemChildren[];
}
