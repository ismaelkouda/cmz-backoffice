export const DEPARTMENTS_BY_REGION_ID_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'code',
            header: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.TABLE.CODE',
            width: '4rem',
        },
        {
            field: 'name',
            header: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.TABLE.NAME',
            width: '10rem',
        },
        {
            field: 'municipalitiesCount',
            header: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.TABLE.MUNICIPALITIES_COUNT',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'populationSize',
            header: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.TABLE.POPULATION_SIZE',
            class: 'text-center',
            width: '2rem',
        },
        /*  {
             field: 'description',
             header: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.TABLE.DESCRIPTION',
             width: '17rem',
         }, */
        {
            field: 'createdAt',
            header: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.TABLE.CREATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        /* {
            field: '__actionDropdown',
            header: 'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS_BY_REGION_ID.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        }, */
    ],
    globalFilterFields: [
        'id',
        'code',
        'name',
        'municipalitiesCount',
        'populationSize',
        /*  'description', */
        'createdAt',
    ],
};

