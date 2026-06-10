import { SlideCreateProps } from '@pages/content-management/domain/interfaces/slide/slide-create-props.interface';
import { SlideCreateVo } from '@pages/content-management/domain/value-objects/slide/slide-create.vo';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export class SlideCreateEntity {
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

    static fromVo(vo: SlideCreateVo): SlideCreateEntity {
        return new SlideCreateEntity(vo);
    }
}
