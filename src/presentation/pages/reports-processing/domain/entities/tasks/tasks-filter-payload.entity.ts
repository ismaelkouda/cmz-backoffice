export interface TasksFilterPayloadEntity {
    created_from: string;
    created_to: string;
    report_type?: string;
    state?: string;
    operator?: string;
}
