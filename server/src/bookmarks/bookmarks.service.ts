import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarksService {
    constructor(private prisma: PrismaService){}

    async createBookmark(userId: number, dto: CreateBookmarkDto){
        const bookmarkData: any = {
            title: dto.title,
            link: dto.link,
            description: dto.description,
            user: {connect: {id: userId}}, 
        }

        if (dto.categoryId) {
            bookmarkData.category = {connect: {id: Number(dto.categoryId)}}
        }

        const bookmark = await this.prisma.bookmarks.create({
            data: {
                ...bookmarkData
            }
        })
        return bookmark;
    }

    async getBookmarks(userId: number) {
        return await this.prisma.bookmarks.findMany({
            where: {
                userId
            }
        });
    }

    async getBookmarkDetails(userId: number, id: number) {
        const result = await this.prisma.bookmarks.findFirst({
            where: {
                id, userId
            },
            include: {
                category: {
                    select: {
                        name: true
                    }
                }
            }
        }); 
        return {message: 'Bookmark details retrieved', ...result};
    }

    async editBookmark(userId: number, id: number, dto: EditBookmarkDto) {
        const bookmark = await this.prisma.bookmarks.findFirst({
            where: {id}
        });
        if (!bookmark) throw new NotFoundException('Bookmark does not exist!');
        if (bookmark.userId != userId) throw new ForbiddenException('Resource denied');
        
        const updatedBookmarkData: any = { ...dto };

        if (dto.categoryId) {
            updatedBookmarkData.category = {connect: {id: Number(dto.categoryId)}};
            delete updatedBookmarkData.categoryId;
        };
        
        const updatedBookmark = await this.prisma.bookmarks.update({
            where: {
                id, userId
            },
            data: { ... updatedBookmarkData }
        });

        return updatedBookmark;
    }

    async deleteBookmark(userId: number, id: number) {
        const bookmark = await this.prisma.bookmarks.findFirst({
            where: {id}
        });
        if (!bookmark) throw new NotFoundException('Bookmark does not exist!');
        if (bookmark.userId != userId) throw new ForbiddenException('Resource denied');

        return await this.prisma.bookmarks.delete({
            where: {
                id
            }
        });
    }

}
