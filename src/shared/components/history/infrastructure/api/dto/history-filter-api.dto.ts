export interface HistoryFilterApiDto {
    type_model: string;
    module?: string;
    search?: string;
    start_date?: Date;
    end_date?: Date;
}
