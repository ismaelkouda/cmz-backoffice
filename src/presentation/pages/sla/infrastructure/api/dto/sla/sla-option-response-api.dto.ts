export interface SlaOptionApiDto {
    id: number;
    name: string;
}
export interface SlaOptionResponseApiDto {
    error: boolean;
    message: string;
    data: SlaOptionApiDto[];
}
