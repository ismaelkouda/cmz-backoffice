import { HomeUpdateDto } from '@pages/content-management/application/dto/home/home-update.dto';
import { HomeUpdateProps } from '@pages/content-management/domain/interfaces/home/home-update-props.interface';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class HomeUpdateVo {
    constructor(private readonly props: HomeUpdateProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get image(): File | null | string {
        return this.props.image;
    }

    get platforms(): string[] {
        return this.props.platforms;
    }

    get period(): DatePeriod {
        return this.props.period;
    }

    get title(): string {
        return this.props.title;
    }

    get resume(): string {
        return this.props.resume;
    }

    get content(): string {
        return this.props.content;
    }

    get buttonLabel(): string | undefined {
        return this.props.buttonLabel;
    }

    get buttonUrl(): string | undefined {
        return this.props.buttonUrl;
    }

    static fromDto(dto: HomeUpdateDto): HomeUpdateVo {
        const period = DatePeriod.create(dto.startDate, dto.endDate);
        return new HomeUpdateVo({
            ...dto,
            period,
        });
    }
}
