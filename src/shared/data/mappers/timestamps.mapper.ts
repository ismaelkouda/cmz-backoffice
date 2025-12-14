import { Injectable } from "@angular/core";
import { TimestampsDto } from "@shared/data/dtos/timestamps.dto";
import { TimestampsEntity } from "@shared/domain/entities/timestamps.entity";
@Injectable({
    providedIn: 'root'
})
export class TimestampsMapper {
    mapToEntity(dtoValue: TimestampsDto): TimestampsEntity {

        return new TimestampsEntity(
            dtoValue.created_at,
            dtoValue.updated_at,
        );
    }

    mapToDto(entityValue: TimestampsEntity): TimestampsDto {

        return {
            created_at: entityValue.createdAt,
            updated_at: entityValue.updatedAt,
        };
    }
}
