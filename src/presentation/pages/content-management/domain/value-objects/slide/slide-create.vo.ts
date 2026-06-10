import { SlideCreateDto } from '@pages/content-management/application/dto/slide/slide-create.dto';
import { SlideCreateProps } from '@pages/content-management/domain/interfaces/slide/slide-create-props.interface';
import { validateSlideCreate } from '@presentation/pages/content-management/application/validators/slide/slide-create.validator';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class SlideCreateVo {
    constructor(private readonly props: SlideCreateProps) {}

    get timeDuration(): number {
        return this.props.timeDuration;
    }

    get type(): string {
        return this.props.type;
    }

    get image(): File | null | string {
        return this.props.image;
    }

    get video(): string | null {
        return this.props.video;
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

    get subtitle(): string {
        return this.props.subtitle;
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

    static fromDto(dto: SlideCreateDto): SlideCreateVo {
        validateSlideCreate(dto);
        const period = DatePeriod.create(dto.startDate, dto.endDate);
        return new SlideCreateVo({
            ...dto,
            period,
        });
    }
}
