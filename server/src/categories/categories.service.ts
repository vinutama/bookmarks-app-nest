import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDto } from './dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService){}

    async createCategory(userId: number, dto: CategoryDto) {
        const category = await this.prisma.categories.create({
            data: {...dto, user: {connect: {id: userId}}}
        })

        return category;
    }
}
