export const DEPARTMENTS_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'code',
            header: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TABLE.CODE',
            width: '4rem',
        },
        {
            field: 'name',
            header: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TABLE.NAME',
            width: '10rem',
        },
        {
            field: 'region',
            header: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TABLE.REGION',
            width: '12rem',
        },
        {
            field: 'municipalitiesCount',
            header: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TABLE.MUNICIPALITIES_COUNT',
            class: 'text-center',
            width: '2rem',
            type: 'badge-button',
        },
        {
            field: 'populationSize',
            header: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TABLE.POPULATION_SIZE',
            class: 'text-center',
            width: '2rem',
            type: 'number'
        },
        /*  {
             field: 'description',
             header: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TABLE.DESCRIPTION',
             width: '17rem',
         }, */
        {
            field: 'createdAt',
            header: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__actionDropdown',
            header: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        },
    ],
    globalFilterFields: [
        'id',
        'code',
        'name',
        'region',
        'municipalitiesCount',
        'populationSize',
        /*  'description', */
        'createdAt',
    ],
};
