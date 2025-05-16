import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { DbModule } from '../db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../db/entities/user.entity';
import { ItemEntity } from '../db/entities/item.entity';
import { BidEntity } from '../db/entities/bid.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guard/jwt.guard';

@Module({
  imports: [
    DbModule,
    TypeOrmModule.forFeature([UserEntity, ItemEntity, BidEntity]),
    JwtModule.register({
      secret: 'kashi420',
      global: true,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [UserService, UserResolver, AuthGuard],
  exports: [UserModule, AuthGuard],
})
export class UserModule {}
