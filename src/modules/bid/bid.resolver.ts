/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BidService } from './bid.service';
import { BidEntity } from '../db/entities/bid.entity';
import { getUser } from '../user/decorators/user.decorator';
import { UserEntity } from '../db/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../user/guard/jwt.guard';

@Resolver()
export class BidResolver {
  constructor(private bidSer: BidService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => BidEntity)
  async createBid(
    @Args('item_id') item_id: string,
    @Args('amount') amount: number,
    @getUser() user: UserEntity,
  ): Promise<BidEntity> {
    return this.bidSer.createBid(item_id, amount, user);
  }
}
