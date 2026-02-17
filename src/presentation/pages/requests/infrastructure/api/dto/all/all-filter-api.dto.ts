export interface AllFilterApiDto {
    initiator_phone_number?: string;
    uniq_id?: string;
    report_type?: string;
    operators?: string[];
    source?: string;
    state?: string;
    start_date?: Date;
    end_date?: Date;
}
