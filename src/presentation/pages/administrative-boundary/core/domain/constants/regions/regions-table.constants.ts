export const REGIONS_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'code',
            header: 'ADMINISTRATIVE_BOUNDARY.REGIONS.TABLE.CODE',
            width: '4rem',
        },
        {
            field: 'name',
            header: 'ADMINISTRATIVE_BOUNDARY.REGIONS.TABLE.NAME',
            width: '10rem',
        },
        {
            field: 'departmentsCount',
            header: 'ADMINISTRATIVE_BOUNDARY.REGIONS.TABLE.DEPARTMENTS_COUNT',
            class: 'text-center',
            width: '2rem',
            type: 'badge-button',
        },
        {
            field: 'municipalitiesCount',
            header: 'ADMINISTRATIVE_BOUNDARY.REGIONS.TABLE.MUNICIPALITIES_COUNT',
            class: 'text-center',
            width: '2rem',
            type: 'badge-button',
        },
        {
            field: 'populationSize',
            header: 'ADMINISTRATIVE_BOUNDARY.REGIONS.TABLE.POPULATION_SIZE',
            class: 'text-center',
            width: '2rem',
            type: 'number'
        },
        /*  {
             field: 'description',
             header: 'ADMINISTRATIVE_BOUNDARY.REGIONS.TABLE.DESCRIPTION',
             width: '17rem',
         }, */
        {
            field: 'createdAt',
            header: 'ADMINISTRATIVE_BOUNDARY.REGIONS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__actionDropdown',
            header: 'ADMINISTRATIVE_BOUNDARY.REGIONS.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        },
    ],
    globalFilterFields: [
        'id',
        'code',
        'name',
        'departmentsCount',
        'municipalitiesCount',
        'populationSize',
        /*  'description', */
        'createdAt',
    ],
};
