import { SlideCreateProps } from '@pages/content-management/domain/interfaces/slide/slide-create-props.interface';
import { SlideCreateVo } from '@pages/content-management/domain/value-objects/slide/slide-create.vo';

export class SlideCreateEntity {
    constructor(private readonly props: SlideCreateProps) {}

    get timeDuration(): number {
        return this.props.timeDuration;
    }

    get order(): number {
        return this.props.order;
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

    get startDate(): Date | null {
        return this.props.startDate;
    }

    get endDate(): Date | null {
        return this.props.endDate;
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
