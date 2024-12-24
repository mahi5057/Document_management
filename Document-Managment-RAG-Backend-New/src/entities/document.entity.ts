import { ObjectId } from 'mongodb';
import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity('documents')
export class Document {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    contentUrl: string; 

    @Column()
    fileType: string;

    @Column()
    fileName: string;

    @Column()
    originalName: string

    @Column()
    author: string;

    @Column({ default: new Date() })
    createdAt: Date;

    @Column()
    userId: ObjectId; 
}




