export class EnvService {

    // API url
    public apiUrl = '';
    public fileUrl = '';

    public headerSettings = {
        appTypePS: '',
        appTypeSM: ''
    };
    public messageApp = {
        sourceStockTenantSim : '',
        sourceStockOrangeSim : '',
        sourceSoldeDotation : '',
        sourceSoldeDotationOrange : '',
    };

    // Whether or not to enable debug mode
    public enableDebug = true;

    constructor() { }

}
