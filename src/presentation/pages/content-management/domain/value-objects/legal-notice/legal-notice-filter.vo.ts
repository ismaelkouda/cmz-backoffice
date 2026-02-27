import { LegalNoticeFilterDto } from '@presentation/pages/content-management/application/dto/legal-notice/legal-notice-filter.dto';

export class LegalNoticeFilterVo {
    public readonly search?: string;
    public readonly version?: string;
    public readonly status?: string;
    public readonly startDate?: string;
    public readonly endDate?: string;

    constructor(props: {
        search?: string;
        version?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
    }) {
        this.search = props.search;
        this.version = props.version;
        this.status = props.status;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
    }

    static fromDto(
        dto: LegalNoticeFilterDto | null = {} as LegalNoticeFilterDto
    ): LegalNoticeFilterVo {
        return new LegalNoticeFilterVo({
            search: dto?.search?.trim() || undefined,
            version: dto?.version,
            status: dto?.status,
            startDate: dto?.startDate,
            endDate: dto?.endDate,
        });
    }
}
