export interface MessagingResponseDto {
    data: {
        data: any[]; // Replace 'any' with specific message item interface
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    message: string;
    status: boolean;
}
