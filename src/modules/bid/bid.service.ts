import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { BidEntity } from '../db/entities/bid.entity';
import { DataSource, Repository } from 'typeorm';
import { ItemEntity } from '../db/entities/item.entity';
import { ForbiddenError } from 'apollo-server-express';
import { UserEntity } from '../db/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BidService implements OnModuleInit {
  // private highestBidCache = new Map<string, number>(); // for in memory cache

  constructor(
    private dataSource: DataSource,
    @InjectRepository(BidEntity)
    private bidRepo: Repository<BidEntity>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async onModuleInit() {
    console.log('cache populated');
    await this.populateCache();
  }

  async populateCache() {
    const itemsWithAmount = await this.bidRepo.find();

    await Promise.all(
      itemsWithAmount.map(
        async ({ item_id, amount }) =>
          await this.cacheManager.set(item_id, amount),
      ),
    );
  }

  async createBid(
    item_id: string,
    amount: number,
    user: UserEntity,
  ): Promise<any> {
    return await this.dataSource.transaction(async (manager) => {
      const highestBid: number | null = await this.cacheManager.get(item_id);
      if (highestBid && highestBid >= amount)
        throw new ForbiddenError(
          `bid amount should be greater then ${highestBid}`,
        );

      const bidrepo = manager.getRepository(BidEntity);
      const itemrepo = manager.getRepository(ItemEntity);

      const timeNow = new Date();
      timeNow.setHours(timeNow.getHours() + 5);
      console.log('time now : ', timeNow);
      const item = await itemrepo
        .createQueryBuilder('item')
        .where('item.id = :id', { id: item_id })
        .setLock('pessimistic_write')
        .getOne();

      if (!item) {
        throw new NotFoundException('Item does not exist against this id');
      }

      if (item.startTime > timeNow)
        throw new BadRequestException('Bidding is not started');

      if (item.endTime && item.endTime < timeNow) {
        await this.cacheManager.del(item_id);
        throw new BadRequestException('Bidding for this item has ended');
      }

      const currentBid = await bidrepo.findOne({
        where: { item: { id: item.id } },
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

      //in memory-cache
      // this.highestBidCache.set(item_id, amount);

      // using cache-manager
      await this.cacheManager.set(item_id, amount);

      await itemrepo.save(item);

      return savedBid;
    });
  }
}
