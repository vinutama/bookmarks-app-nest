import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto';

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
        return await this.prisma.bookmarks.findFirst({
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
    }
}
