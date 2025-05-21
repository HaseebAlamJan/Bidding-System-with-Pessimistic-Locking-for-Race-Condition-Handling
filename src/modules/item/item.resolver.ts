/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ItemEntity } from '../db/entities/item.entity';
import { ItemService } from './item.service';
import { InputDto } from './dto/create.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../user/guard/jwt.guard';

@Resolver((of) => ItemEntity)
export class ItemResolver {
  constructor(private itemSer: ItemService) {}

  @Mutation(() => ItemEntity)
  async createItem(@Args('input') input: InputDto): Promise<ItemEntity> {
    return this.itemSer.createItem(input);
  }

  @Mutation(() => ItemEntity)
  async closeBid(
    @Args('team_id') team_id: string,
    @Args('end_time') end_time: Date,
  ) {
    return this.itemSer.closeBid(team_id, end_time);
  }

  @Query(() => String)
  sayHello(): string {
    return 'smack that';
  }
}
