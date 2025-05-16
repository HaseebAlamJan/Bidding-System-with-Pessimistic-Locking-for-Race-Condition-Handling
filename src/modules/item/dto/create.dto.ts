import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class InputDto {
  @Field()
  @IsNotEmpty()
  itemName: string;

  @Field()
  @IsDate()
  @IsNotEmpty()
  startTime: Date;

  @Field()
  @IsDate()
  @IsOptional()
  duration?: number;

  @Field()
  @IsDate()
  @IsOptional()
  endTime?: Date;
}
