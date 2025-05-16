/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserEntity } from '../db/entities/user.entity';
import { UserService } from './user.service';
import { UserInputDto } from './dto/user-input.dto';
import { LoginDto } from './dto/login.dto';
import { ReturnUser } from './dto/user-return.dto';

@Resolver((of) => UserEntity)
export class UserResolver {
  constructor(private userSer: UserService) {}

  @Mutation(() => String)
  async registerUser(
    @Args('userInput') userInput: UserInputDto,
  ): Promise<string> {
    return this.userSer.registerUser(userInput);
  }

  @Mutation(() => ReturnUser)
  async login(@Args('userLogin') userLogin: LoginDto): Promise<ReturnUser> {
    return this.userSer.login(userLogin);
  }
}
