export interface QueuesFilterPayloadEntity {
    created_from: string;
    created_to: string;
    uniq_id?: string;
    report_type?: string;
    state?: string;
    operator?: string;
}
