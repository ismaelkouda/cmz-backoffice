export interface InfrastructureFilterDto {
    search?: string;
    type?: string;
    region?: string;
    department?: string;
    municipality?: string;
    startDate?: Date;
    endDate?: Date;
}
