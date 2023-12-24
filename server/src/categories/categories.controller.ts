import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUserLogin } from '../custom-decorators';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto';

@UseGuards(JwtGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoriesService){}

    @Post()
    createBookmark(@GetUserLogin('id') userId: number, @Body() dto: CategoryDto) {
        return this.categoryService.createCategory(userId, dto);
    }
}
