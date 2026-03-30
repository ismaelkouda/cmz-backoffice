import { Injectable } from '@angular/core';
import { ProfilesDto } from '@shared/data/dto/profiles.dto';
import { Profiles } from '@shared/domain/enums/profiles.enum';

@Injectable({
    providedIn: 'root',
})
export class ProfilesMapper {
    mapFromDto(dtoValue: ProfilesDto): Profiles {
        const methodMap: Record<ProfilesDto, Profiles> = {
            [ProfilesDto.SUPERVISOR]: Profiles.SUPERVISOR,
            [ProfilesDto.LEADER]: Profiles.LEADER,
            [ProfilesDto.AGENT]: Profiles.AGENT,
        };
        return methodMap[dtoValue] || Profiles.AGENT;
    }
}
