import { TableConfig } from '@shared/domain/services/table-export-excel-file.service';

export const RADIO_RELAY_LINKS_TABLE: TableConfig = {
    cols: [
        { field: '__index', header: '#', width: '50px' },
        {
            field: 'name',
            header: 'COVERAGE_AREAS.RADIO_RELAY_LINKS.TABLE.NAME',
            width: '200px',
        },
        {
            field: 'operator',
            header: 'COVERAGE_AREAS.RADIO_RELAY_LINKS.TABLE.OPERATOR',
            width: '120px',
        },
        {
            field: 'frequency',
            header: 'COVERAGE_AREAS.RADIO_RELAY_LINKS.TABLE.FREQUENCY',
            width: '120px',
        },
        {
            field: 'startDate',
            header: 'COVERAGE_AREAS.RADIO_RELAY_LINKS.TABLE.START_DATE',
            width: '120px',
        },
        {
            field: 'endDate',
            header: 'COVERAGE_AREAS.RADIO_RELAY_LINKS.TABLE.END_DATE',
            width: '120px',
        },
        {
            field: '__actionDropdown',
            header: 'COVERAGE_AREAS.RADIO_RELAY_LINKS.TABLE.ACTION',
            width: '120px',
            type: 'action-dropdown',
        },
    ],
    globalFilterFields: ['name', 'operator', 'frequency'],
};
