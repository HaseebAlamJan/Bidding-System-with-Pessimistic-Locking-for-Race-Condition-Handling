import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntity } from '../db/entities/item.entity';
import { Repository } from 'typeorm';
import { InputDto } from './dto/create.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepo: Repository<ItemEntity>,
  ) {}

  async createItem(input: InputDto): Promise<ItemEntity> {
    const { startTime, endTime, itemName } = input;
    if (endTime && endTime > startTime) {
      input.duration = (startTime.getTime() - endTime.getTime()) / (1000 * 60);
    } else
      throw new BadRequestException(
        'EndDate should be greater than start date',
      );
    const create = this.itemRepo.create({
      itemName,
      startTime,
      endTime,
    });
    return await this.itemRepo.save(create);
  }

  async closeBid(item_id: string, end_time: Date): Promise<ItemEntity> {
    const item = await this.itemRepo.findOneOrFail({ where: { id: item_id } });
    if (!item) throw new NotFoundException('item not found agaisnt this id');
    if (end_time < item.startTime)
      throw new BadRequestException(
        'endDate can never be smaller then start date',
      );
    item.endTime = end_time;
    return await this.itemRepo.save(item);
  }
}
