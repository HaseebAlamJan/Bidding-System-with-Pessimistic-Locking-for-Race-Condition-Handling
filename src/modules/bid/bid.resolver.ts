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
    @Args('item_id') item_id: string, // before triggering the endpoint i nend to check at global level using redis or cache_mem
    @Args('amount') amount: number,
    @getUser() user: UserEntity,
  ): Promise<BidEntity> {
    return this.bidSer.createBid(item_id, amount, user);
  }

  // @Mutation(() => String)
  // async raceConditionSameBid() {
  //   const amountToBid = 500;

  //   const user1 = new UserEntity();
  //   user1.id = 'be714aec-6781-45e8-ab39-eec4fd5f950c';
  //   user1.username = 'alamjan';

  //   const user2 = new UserEntity();
  //   user2.id = 'c4b7bfc8-65bc-4656-80aa-0d273590667e';
  //   user2.username = 'haseebalam';

  //   const user3 = new UserEntity();
  //   user3.id = 'cebb6900-551c-48d6-9e9a-600dd60c749c';
  //   user3.username = 'janjan';

  //   const itemId = '444e24d5-c3e7-41fe-9955-736578ee9414';

  //   const bidPromises = [
  //     this.bidSer.createBid(itemId, amountToBid, user1).catch((err) => err),
  //     this.bidSer.createBid(itemId, amountToBid, user2).catch((err) => err),
  //     this.bidSer.createBid(itemId, amountToBid, user3).catch((err) => err),
  //   ];

  //   const results = await Promise.allSettled(bidPromises);
  //   return results;
  // }
}
