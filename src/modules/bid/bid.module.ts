import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidResolver } from './bid.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../db/entities/user.entity';
import { ItemEntity } from '../db/entities/item.entity';
import { BidEntity } from '../db/entities/bid.entity';
import { UserModule } from '../user/user.module';
import { AuthGuard } from '../user/guard/jwt.guard';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserEntity, ItemEntity, BidEntity]),
  ],
  providers: [BidService, BidResolver, AuthGuard],
})
export class BidModule {}
