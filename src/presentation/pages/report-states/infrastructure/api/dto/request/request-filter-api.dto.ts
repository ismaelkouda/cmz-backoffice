export interface RequestFilterApiDto {
    initiator_phone_number?: string;
    uniq_id?: string;
    report_uniq_id?: string;
    report_type?: string;
    operators?: string[];
    source?: string;
    start_date?: Date;
    end_date?: Date;
}
