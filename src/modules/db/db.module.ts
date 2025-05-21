import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ItemEntity } from './entities/item.entity';
import { BidEntity } from './entities/bid.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'alam',
      database: 'bid_db',
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: false,
      extra: {
        Options: '-c timezone=UTC',
      },
    }),
    TypeOrmModule.forFeature([UserEntity, ItemEntity, BidEntity]),
  ],
  providers: [],
  exports: [DbModule],
})
export class DbModule {}
