import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarksService {
    constructor(private prisma: PrismaService){}

    async createBookmark(userId: string, dto: CreateBookmarkDto){
        const bookmarkData: any = {
            title: dto.title,
            link: dto.link,
            description: dto.description,
            category: {connect: {id: dto.categoryId}}, 
        }

        const bookmark = await this.prisma.bookmarks.create({
            data: {
                ...bookmarkData
            }
        })
        return bookmark;
    }

    async getBookmarks(userId: string, categoryId: string) {
        return await this.prisma.bookmarks.findMany({
            where: {
                categoryId
            }
        });
    }

    async getBookmarkDetails(userId: string, id: string) {
        const result = await this.prisma.bookmarks.findFirst({
            where: {
                id
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

    async editBookmark(userId: string, id: string, dto: EditBookmarkDto) {
        const bookmark = await this.prisma.bookmarks.findFirst({
            where: {id},
            include: {
                category: {
                    include: {
                        organization: {select: {userId: true}}
                    }
                }
            }
        });
        if (!bookmark) throw new NotFoundException('Bookmark does not exist!');
        if (bookmark.category.organization.userId != userId) throw new ForbiddenException('Resource denied');
        
        const updatedBookmarkData: any = { ...dto };

        if (dto.categoryId) {
            updatedBookmarkData.category = {connect: {id: String(dto.categoryId)}};
            delete updatedBookmarkData.categoryId;
        };
        
        const updatedBookmark = await this.prisma.bookmarks.update({
            where: {
                id
            },
            data: { ... updatedBookmarkData }
        });

        return updatedBookmark;
    }

    async deleteBookmark(userId: string, id: string) {
        const bookmark = await this.prisma.bookmarks.findFirst({
            where: {id},
            include: {
                category: {
                    include: {
                        organization: {select: {userId: true}}
                    }
                }
            }
        });
        if (!bookmark) throw new NotFoundException('Bookmark does not exist!');
        if (bookmark.category.organization.userId != userId) throw new ForbiddenException('Resource denied');

        return await this.prisma.bookmarks.delete({
            where: {
                id
            }
        });
    }

}
