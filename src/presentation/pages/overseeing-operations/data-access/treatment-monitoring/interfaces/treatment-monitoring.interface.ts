import { Folder } from '../../../../../../shared/interfaces/folder';
import { Paginate } from '../../../../../../shared/interfaces/paginate';

export interface treatmentMonitoringApiResponseInterface {
    error: boolean;
    message: string;
    data: Paginate<Folder>;
}
