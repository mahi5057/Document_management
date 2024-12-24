export interface EntityConfig {
    type: string;
    fields: { key: string; label: string , allowToUpdate?:boolean}[];
    isChat?: boolean;
    rolesOptions?: Array<any>
}