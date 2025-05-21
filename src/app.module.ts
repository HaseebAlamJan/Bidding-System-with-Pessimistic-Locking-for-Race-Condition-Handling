import { Module } from '@nestjs/common';
import { BidModule } from './modules/bid/bid.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './modules/user/user.module';
import { DbModule } from './modules/db/db.module';
import { ItemModule } from './modules/item/item.module';
import { AuthGuard } from './modules/user/guard/jwt.guard';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    BidModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      playground: true,
    }),
    CacheModule.register({
      store: redisStore, // by default it connects to local redis server with local port
      host: '127.0.0.1',
      port: 6379,
      isGlobal: true,
      ttl: 0,
    }),
    UserModule,
    DbModule,
    ItemModule,
  ],
  controllers: [],
  providers: [AuthGuard],
})
export class AppModule {}
