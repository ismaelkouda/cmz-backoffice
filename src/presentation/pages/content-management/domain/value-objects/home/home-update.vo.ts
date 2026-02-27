import { Platform } from '@shared/domain/enums/platform.enum';

import { HomeUpdateDto } from '@presentation/pages/content-management/application/dto/home/home-update.dto';

export class HomeUpdateVo {
    public readonly uniqId: string;
    public readonly image: string;
    public readonly platforms: Platform[];
    public readonly startDate: string;
    public readonly endDate: string;
    public readonly title: string;
    public readonly resume: string;
    public readonly content: string;
    public readonly buttonLabel?: string;
    public readonly buttonUrl?: string;

    constructor(props: {
        uniqId: string;
        image: string;
        platforms: Platform[];
        startDate: string;
        endDate: string;
        title: string;
        resume: string;
        content: string;
        buttonLabel?: string;
        buttonUrl?: string;
    }) {
        this.uniqId = props.uniqId;
        this.image = props.image;
        this.platforms = props.platforms;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.title = props.title;
        this.resume = props.resume;
        this.content = props.content;
        this.buttonLabel = props.buttonLabel;
        this.buttonUrl = props.buttonUrl;
    }

    static fromDto(dto: HomeUpdateDto): HomeUpdateVo {
        return new HomeUpdateVo({
            uniqId: dto.uniqId,
            image: dto.image,
            platforms: dto.platforms,
            startDate: dto.startDate,
            endDate: dto.endDate,
            title: dto.title,
            resume: dto.resume,
            content: dto.content,
            buttonLabel: dto.buttonLabel,
            buttonUrl: dto.buttonUrl,
        });
    }
}
