import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUserLogin } from '../custom-decorators';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarksController {
    constructor(private bookmarkService: BookmarksService){}

    @Post()
    createBookmark(
        @GetUserLogin('id') userId: string, 
        @Body() dto: CreateBookmarkDto
    ) {
        return this.bookmarkService.createBookmark(userId, dto);
    }

    @Get('/category/:categoryId')
    getBookmarks(
        @GetUserLogin('id') userId: string, 
        @Param('categoryId') categoryId: string
    ) {
        return this.bookmarkService.getBookmarks(userId, categoryId);
    }

    @Get(':bookmarkId')
    getBookmarkDetails(
        @GetUserLogin('id') userId: string,
        @Param('bookmarkId') id: string        
    ) {
        return this.bookmarkService.getBookmarkDetails(userId, id);
    }

    @Patch(':bookmarkId')
    editBookmark(
        @GetUserLogin('id') userId: string,
        @Param('bookmarkId') id: string,
        @Body() dto: EditBookmarkDto
    ) {
        return this.bookmarkService.editBookmark(userId, id, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':bookmarkId')
    deleteBookmark(
        @GetUserLogin('id') userId: string,
        @Param('bookmarkId') id: string
    ) {
        return this.bookmarkService.deleteBookmark(userId, id);
    }
}
