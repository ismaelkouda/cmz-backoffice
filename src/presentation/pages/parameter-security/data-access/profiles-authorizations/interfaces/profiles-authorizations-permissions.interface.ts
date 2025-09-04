export interface ProfilesAuthorizationsPermissionsInterface {
    data: {
        title: string;
        value: string;
        checked: boolean;
    };
    children?: ProfilesAuthorizationsPermissionsInterface[];
}
