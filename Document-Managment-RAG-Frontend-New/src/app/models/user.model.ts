// import { Role } from 'src/enums/roles.enum';
export class User {
    id?: string;
    username!: string;
    name!: string;
    password!: string;
    email!: string;
}

export class CurrentUser {
    username!: string;
    name!: string;
    roles!: string[]
}

export class LoginUser {
    email!: string;
    password!: string;
}

export class UserModel {
    constructor(
        public id: string,
        public username: string,
        public name: string,
        public email: string,
        public roles: string[],
        public createdAt: Date
    ) {}
}
