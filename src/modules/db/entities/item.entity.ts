import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BidEntity } from './bid.entity';

@ObjectType('items')
@Entity('item')
export class ItemEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  itemName: string;

  @Field(() => GraphQLISODateTime)
  @Column({ type: 'timestamptz', nullable: true })
  startTime: Date;

  @Field(() => Float, { nullable: true })
  @Column('decimal', { nullable: true })
  duration?: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  endTime?: Date;

  @Field(() => BidEntity, { nullable: true })
  @OneToMany(() => BidEntity, (bids) => bids.item)
  bids: BidEntity[];

  @Column({ nullable: true })
  highest_bid_id: string;

  @Field(() => BidEntity, { nullable: true })
  @OneToOne(() => BidEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'highest_bid_id' })
  highestBid: BidEntity;
}
