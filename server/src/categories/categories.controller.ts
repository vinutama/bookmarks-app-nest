import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUserLogin } from '../custom-decorators';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, EditCategoryDto } from './dto';

@UseGuards(JwtGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoriesService){}

    @Post()
    createCategory(@GetUserLogin('id') userId: string, @Body() dto: CreateCategoryDto) {
        return this.categoryService.createCategory(userId, dto);
    }

    @Get('/organization/:organizationId')
    getCategories(
        @GetUserLogin('id') userId: string,
        @Param('organizationId') organizationId: string
    ) {
        return this.categoryService.getCategories(userId, organizationId);
    }

    @Get(':categoryId')
    getCategoryDetails(
        @GetUserLogin('id') userId: string,
        @Param('categoryId') id: string
    ) {
        return this.categoryService.getCategoryDetails(userId, id);
    }

    @Patch(':categoryId')
    editCategory(
        @GetUserLogin('id') userId: string,
        @Param('categoryId') id: string,
        @Body() dto: EditCategoryDto
    ) {
        return this.categoryService.editCategory(userId, id, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':categoryId')
    deleteCategory(
        @GetUserLogin('id') userId: string,
        @Param('categoryId') id: string
    ) {
        return this.categoryService.deleteCategory(userId, id);
    }
}
