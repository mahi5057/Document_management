import { Role } from 'src/enums/roles.enum';
import { Entity, PrimaryGeneratedColumn,Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string; 

    @Column()
    username: string; 

    @Column()
    name: string;

    @Column()
    password: string; 

    @Column()
    email: string;

    @Column()
    roles: Role; 

    @Column()
    createdAt: Date; 
}
