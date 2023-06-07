import { Controller, Post, Body } from '@nestjs/common';
import { CreateItemDto } from './dtos/create-item.dto';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private itemService: ItemsService) {}
  @Post()
  createItem(@Body() body: CreateItemDto) {
    return this.itemService.create(body);
  }
}
