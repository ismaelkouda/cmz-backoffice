import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface AllFilterApiDto {
    initiator_phone_number?: string;
    uniq_id?: string;
    request_report_uniq_id?: string;
    report_type?: ReportType;
    operators?: string[];
    source?: string;
    start_date?: Date;
    end_date?: Date;
}
