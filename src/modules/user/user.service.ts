import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../db/entities/user.entity';
import { Repository } from 'typeorm';
import { UserInputDto } from './dto/user-input.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ReturnUser } from './dto/user-return.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private jwtSer: JwtService,
  ) {}

  async registerUser(userInput: UserInputDto): Promise<string> {
    const { firstName, lastName, username, password } = userInput;
    const hashedPassword: string = await bcrypt.hash(password, 6);
    const user = this.userRepo.create({
      firstName,
      lastName,
      username,
      password: hashedPassword,
    });
    if (!user) throw new NotFoundException('User cannot register');

    await this.userRepo.save(user);
    return 'user register successfully';
  }

  async login(userLogin: LoginDto): Promise<ReturnUser> {
    const { username, password } = userLogin;
    const user = await this.userRepo.findOneOrFail({
      where: { username: username },
    });
    if (!user) throw new NotFoundException('user is not registered');
    const check = await bcrypt.compare(password, user.password);
    if (!check) throw new BadRequestException('incorrect password');
    const accessToken: string = this.jwtSer.sign({
      sub: user.id,
      username: user.username,
    });
    return {
      accessToken,
      user,
    };
  }
}
