import { ReportNewspaperFilterDto } from '@shared/components/report-newspaper/application/dto/report-newspaper-filter.dto';

export class ReportNewspaperFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: ReportNewspaperFilterDto): ReportNewspaperFilterVo {
        return new ReportNewspaperFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
