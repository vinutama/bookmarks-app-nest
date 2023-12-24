import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUserLogin } from '../custom-decorators';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarksController {
    constructor(private bookmarkService: BookmarksService){}

    @Post()
    createBookmark(
        @GetUserLogin('id') userId: number, 
        @Body() dto: CreateBookmarkDto
    ) {
        return this.bookmarkService.createBookmark(userId, dto);
    }

    @Get()
    getBookmarks(@GetUserLogin('id') userId: number) {
        return this.bookmarkService.getBookmarks(userId)
    }

    @Get(':bookmarkId')
    getBookmarkDetails(
        @GetUserLogin('id') userId: number,
        @Param('bookmarkId', ParseIntPipe) id: number        
    ) {
        return this.bookmarkService.getBookmarkDetails(userId, id);
    }

    editBookmark() {}

    deleteBookmark() {}
}
