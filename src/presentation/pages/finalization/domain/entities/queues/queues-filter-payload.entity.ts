export interface QueuesFilterPayloadEntity {
    created_from: string;
    created_to: string;
    report_type?: string;
    state?: string;
    operator?: string;
}
