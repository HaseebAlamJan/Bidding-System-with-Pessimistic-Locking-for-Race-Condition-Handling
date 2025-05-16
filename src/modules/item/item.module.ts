import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemResolver } from './item.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../db/entities/user.entity';
import { ItemEntity } from '../db/entities/item.entity';
import { BidEntity } from '../db/entities/bid.entity';
import { DbModule } from '../db/db.module';

@Module({
  imports: [
    DbModule,
    TypeOrmModule.forFeature([UserEntity, ItemEntity, BidEntity]),
  ],
  providers: [ItemService, ItemResolver],
  exports: [ItemModule],
})
export class ItemModule {}
