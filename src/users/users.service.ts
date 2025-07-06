import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { isValidObjectId, Model } from 'mongoose';
import { faker } from '@faker-js/faker';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async onModuleInit() {
    const count = await this.userModel.countDocuments();
    if (count === 0) {
      const dataToInsert: any = [];
      for (let i = 0; i < 100_000; i++) {
        const userName = faker.internet.userName();
        dataToInsert.push({
          email: `${userName}_${i}@example.com`,
          age: faker.number.int({ min: 18, max: 100 }),
          fullName: faker.book.author(),
          lastName: faker.book.publisher(),
        });
      }
      await this.userModel.insertMany(dataToInsert);
      console.log('inserted successfully');
    }
  }
  async create(createUserDto: CreateUserDto) {
    const { email, fullName, lastName, age } = createUserDto;
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new BadRequestException('User Already exists');
    }
    const createdUser = await this.userModel.create({
      email,
      fullName,
      lastName,
      age,
    });
    return {
      message: 'user successfully created',
      user: createdUser,
    };
  }

  async findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id format');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id format');
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('user not found');
    }
    return {
      message: 'user updated successfully',
      user: updatedUser,
    };
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id format');
    }
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException('user not found');
    }
    return {
      message: 'user deleted successfully',
      user: deletedUser,
    };
  }
}
