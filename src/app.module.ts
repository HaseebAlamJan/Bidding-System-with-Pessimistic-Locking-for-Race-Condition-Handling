import { Module } from '@nestjs/common';
import { BidModule } from './modules/bid/bid.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './modules/user/user.module';
import { DbModule } from './modules/db/db.module';
import { ItemModule } from './modules/item/item.module';
import { AuthGuard } from './modules/user/guard/jwt.guard';

@Module({
  imports: [
    BidModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      playground: true,
    }),
    UserModule,
    DbModule,
    ItemModule,
  ],
  controllers: [],
  providers: [AuthGuard],
})
export class AppModule {}
