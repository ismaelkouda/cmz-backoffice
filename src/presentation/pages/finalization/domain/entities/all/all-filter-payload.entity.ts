export interface AllFilterPayloadEntity {
    initiator_phone_number: string;
    start_date: string;
    end_date: string;
    uniq_id?: string;
    report_type?: string;
    source?: string;
    operators?: string[];
    state?: string;
}
