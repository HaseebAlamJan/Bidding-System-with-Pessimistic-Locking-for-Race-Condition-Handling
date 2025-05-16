import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BidEntity } from '../db/entities/bid.entity';
import { DataSource, Repository } from 'typeorm';
import { ItemEntity } from '../db/entities/item.entity';
import { ForbiddenError } from 'apollo-server-express';
import { UserEntity } from '../db/entities/user.entity';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(BidEntity)
    private bidRepo: Repository<BidEntity>,
    @InjectRepository(ItemEntity)
    private itemRepo: Repository<ItemEntity>,
    private dataSource: DataSource,
  ) {}

  async createBid(
    item_id: string,
    amount: number,
    user: UserEntity,
  ): Promise<any> {
    return await this.dataSource.transaction(async (manager) => {
      const bidrepo = manager.getRepository(BidEntity);
      const itemrepo = manager.getRepository(ItemEntity);

      const timeNow = new Date();
      const item = await itemrepo
        .createQueryBuilder('item')
        .where('item.id = :id', { id: item_id })
        .setLock('pessimistic_write')
        .getOne();

      if (!item) {
        throw new NotFoundException('Item does not exist against this id');
      }
      if (item.endTime && item.endTime < timeNow) {
        throw new BadRequestException('Bidding for this item has ended');
      }

      const currentBid = await bidrepo.findOne({
        where: { id: item.highest_bid_id },
      });
      if (currentBid && Number(amount) <= Number(currentBid.amount)) {
        throw new ForbiddenError(
          `Your bid must be higher than ${currentBid.amount}`,
        );
      }
      const bid = bidrepo.create({
        item: item,
        user: user,
        amount,
        createdAt: new Date(),
      });
      const savedBid = await bidrepo.save(bid);

      item.highest_bid_id = savedBid.id;

      await itemrepo.save(item);
      const recentBid = bidrepo.findOneOrFail({
        where: { id: savedBid.id },
      });
      return recentBid;
    });
  }
}
