import { Field, Float, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class InputDto {
  @Field()
  @IsNotEmpty()
  itemName: string;

  @Field()
  @IsDate()
  @IsNotEmpty()
  startTime: Date;

  @Field(() => Float, { nullable: true })
  @IsDate()
  @IsOptional()
  @IsNumber()
  duration?: number;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  endTime?: Date;
}
