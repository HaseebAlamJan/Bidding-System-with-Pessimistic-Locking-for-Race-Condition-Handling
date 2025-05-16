import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'src/modules/db/entities/user.entity';
import { Column } from 'typeorm';

@ObjectType()
export class ReturnUser {
  @Field()
  @Column()
  accessToken: string;

  @Field(() => UserEntity)
  @Column()
  user: UserEntity;
}
