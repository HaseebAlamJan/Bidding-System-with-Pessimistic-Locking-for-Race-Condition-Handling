import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ItemEntity } from './item.entity';

@ObjectType('bids')
@Entity('bid')
export class BidEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Number)
  @Column('decimal')
  amount: number;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.bids, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @Column('uuid')
  user_id: string;

  @Field(() => ItemEntity)
  @ManyToOne(() => ItemEntity, (item) => item.bids, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: ItemEntity;

  @Column('uuid')
  item_id: string;
}
