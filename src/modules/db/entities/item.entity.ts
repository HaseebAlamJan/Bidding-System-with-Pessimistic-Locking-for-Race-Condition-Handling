import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
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
  @Column({ type: 'timestamp', nullable: false })
  startTime: Date;

  @Field(() => Number, { nullable: true })
  @Column('decimal', { nullable: true })
  duration?: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column('timestamp', { nullable: true })
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
