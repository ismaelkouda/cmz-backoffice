export interface ManagementItemDto {
    id: string;
}

export interface ManagementResponseDto {
    error: boolean;
    message: string;
    data: ManagementItemDto;
}
