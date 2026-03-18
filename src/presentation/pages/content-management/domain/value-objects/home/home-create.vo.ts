import { HomeCreateDto } from '@pages/content-management/application/dto/home/home-create.dto';
import { HomeCreateProps } from '@pages/content-management/domain/interfaces/home/home-create-props.interface';
import { Platform } from '@shared/domain/enums/platform.enum';

export class HomeCreateVo {
    constructor(private readonly props: HomeCreateProps) {}

    get image(): File | null | string {
        return this.props.image;
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

    static fromDto(dto: HomeCreateDto): HomeCreateVo {
        return new HomeCreateVo(dto);
    }
}
