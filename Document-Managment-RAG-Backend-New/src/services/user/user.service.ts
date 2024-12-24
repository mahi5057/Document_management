import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/enums/roles.enum';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: MongoRepository<User>,
    ) { }

    async register(username: string, name: string, email: string, password: string): Promise<any> {
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            username,
            name,
            email,
            password: hashedPassword,
            roles:  Role.Admin,
            createdAt: new Date(),
        });
        await this.userRepository.save(user);
        return { "message": 'User registered successfully' };
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            const { email, ...result } = user;
            return result;
        }
        return null;
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findByUsername(username: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { username: username }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async findById(id: ObjectId): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { _id: id }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async updateUser(
        id: ObjectId,
        updateData: Partial<Omit<UpdateUserDto, 'id'>> // Exclude 'id' from updates
    ): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { _id: id } });

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        Object.assign(user, updateData);
        await this.userRepository.save(user);

        return true;
    }

    async remove(id: string, userId: ObjectId): Promise<void> {
        const objectId = new ObjectId(id);
        const filter: any = { _id: objectId, userId };
        await this.userRepository.delete(filter);
    }

    async deleteUsers(ids: string[]): Promise<void> {
        const objectIds = ids.map(id => new ObjectId(id));
        await this.userRepository.deleteMany({ _id: { $in: objectIds } });
    }
}
