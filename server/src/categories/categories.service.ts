import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, EditCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService){}

    async createCategory(userId: string, dto: CreateCategoryDto) {
        const organization = await this.prisma.organizations.findUnique({
            where: {id: dto.organizationId},
            select: {
                userId: true
            }
        })

        if (userId != organization.userId) throw new ForbiddenException('Resource denied');


        const category = await this.prisma.categories.create({
            data: {name: dto.name, organization: {connect: {id: dto.organizationId}}}
        })

        return category;
    }

    async getCategories(userId: string, organizationId: string) {
        return await this.prisma.categories.findMany({
            where: {
                organizationId
            }
        });
    }

    async getCategoryDetails(userId: string, id: string) {
        const result = await this.prisma.categories.findFirst({
            where: {
                id
            }
        });
        return {message: 'Category details retrieved', ...result};
    }

    async editCategory(userId: string, id: string, dto: EditCategoryDto) {
        const category = await this.prisma.categories.findFirst({
            where: {
                id
            },
            include: {
                organization: {}
            }
        });
        if (!category) throw new NotFoundException('Category does not exist!');
        if(category.organization.userId != userId) throw new ForbiddenException('Resource denied');

        return await this.prisma.categories.update({
            where: {
                id
            },
            data: { ...dto }
        });
    }

    async deleteCategory(userId: string, id: string) {
        const category = await this.prisma.categories.findFirst({
            where: {id},
            include: {
                organization: {}
            }
        });
        if (!category) throw new NotFoundException('Category does not exist!');
        if (category.organization.userId != userId) throw new ForbiddenException('Resource denied');

        return await this.prisma.categories.delete({
            where: {
                id
            }
        });
    }
}
