import { Injectable } from '@angular/core';
import { RadioRelayLinksCreateValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-create.validate-contract';
import { RadioRelayLinksCreateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-create-api.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksCreateMapper {
    execute(
        contract: RadioRelayLinksCreateValidateContract
    ): RadioRelayLinksCreateApiDto {
        return {
            name: contract.name,
            operator: contract.operator,
            frequency: contract.frequency,
            first_point_lng: contract.longitudePointA,
            first_point_lat: contract.latitudePointA,
            second_point_lng: contract.longitudePointB,
            second_point_lat: contract.latitudePointB,
            geom_file: contract.geomFile,
        };
    }
}
