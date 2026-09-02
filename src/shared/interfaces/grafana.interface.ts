export interface GrafanaVariablesResponse {
    error: boolean;
    message: string;
    data: Record<string, string>;
}

export interface DashboardTokenRequestDto {
    dashboard_uid: string;
}

export interface DashboardTokenResponseDto {
    error: boolean;
    message: string;
    data: DashboardTokenDataDto;
}

export interface DashboardTokenDataDto {
    token: string;
    embed_url: string;
    expires_in: number;
}
