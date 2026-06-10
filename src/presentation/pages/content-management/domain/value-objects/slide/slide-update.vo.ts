import { SlideUpdateDto } from '@pages/content-management/application/dto/slide/slide-update.dto';
import { SlideUpdateProps } from '@pages/content-management/domain/interfaces/slide/slide-update-props.interface';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class SlideUpdateVo {
    constructor(private readonly props: SlideUpdateProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

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

    static fromDto(dto: SlideUpdateDto): SlideUpdateVo {
        const period = DatePeriod.create(dto.startDate, dto.endDate);

        return new SlideUpdateVo({
            ...dto,
            period,
        });
    }
}
