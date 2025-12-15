
import { Injectable } from "@angular/core";
import { ActorDto } from "@shared/data/dtos/actor.dto";
import { ActorEntity } from "@shared/domain/entities/actor.entity";
@Injectable({
    providedIn: 'root'
})

export class ActorMapper {
    mapToEntity(dtoValue: ActorDto | null): ActorEntity | null {
        if (!dtoValue) return null;

        return new ActorEntity(
            dtoValue.id,
            dtoValue.first_name,
            dtoValue.last_name,
            dtoValue.phone,
        );
    }

    mapToDto(entityValue: ActorEntity | null): ActorDto | null {
        if (!entityValue) return null;

        return {
            id: entityValue.id,
            first_name: entityValue.firstName,
            last_name: entityValue.lastName,
            phone: entityValue.phone,
        };
    }
}
