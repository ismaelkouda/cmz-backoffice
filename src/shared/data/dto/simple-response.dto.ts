export interface Paginate<T, S = never> {
    current_page: number;
    data: T[];
    stats: S;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
    total: number;
}

export interface Link {
    url: string;
    label: string;
    active: boolean;
}

export interface PaginatedResponseDto<T, S = never> {
    error: boolean;
    message: string;
    data: Paginate<T, S>;
}

export interface SimpleResponseDto<T> {
    error: boolean;
    message: string;
    data: T;
}

export interface MessageResponseDto {
    error: boolean;
    message: string;
}
