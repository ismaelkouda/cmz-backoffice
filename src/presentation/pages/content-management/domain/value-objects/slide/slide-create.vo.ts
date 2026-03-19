import { SlideCreateDto } from '@pages/content-management/application/dto/slide/slide-create.dto';
import { SlideCreateProps } from '@pages/content-management/domain/interfaces/slide/slide-create-props.interface';
import { Platform } from '@shared/domain/enums/platform.enum';

export class SlideCreateVo {
    constructor(private readonly props: SlideCreateProps) {}

    get timeDuration(): number {
        return this.props.timeDuration;
    }

    get type(): string {
        return this.props.type;
    }

    get image(): File | null {
        return this.props.image;
    }

    get video(): string | null {
        return this.props.video;
    }

    get platforms(): Platform[] {
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

    static fromDto(dto: SlideCreateDto): SlideCreateVo {
        return new SlideCreateVo(dto);
    }
}
