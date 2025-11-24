export interface TasksFilterPayloadEntity {
    initiator_phone_number: string;
    created_from: string;
    created_to: string;
    uniq_id?: string;
    report_type?: string;
    source?: string;
    operator?: string[];
}
