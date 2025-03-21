export interface ThirdLevelInterface {
    id: number;
    uuid: string;
    code: string;
    nom: string;
  }
  
  export interface ApiResponseThirdLevelInterface {
    error: boolean;
    message: string;
    data: Array<ThirdLevelInterface>;
  }
  