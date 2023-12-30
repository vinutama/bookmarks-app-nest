import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDto } from './dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService){}

    async createCategory(userId: string, dto: CategoryDto) {
        const organizationUserId = this.prisma.organizations.findUnique({
            where: {id: dto.organizationId},
            select: {
                userId: true
            }
        })

        if (userId != String(organizationUserId)) throw new ForbiddenException('Resource denied');


        const category = await this.prisma.categories.create({
            data: {name: dto.name, organization: {connect: {id: dto.organizationId}}}
        })

        return category;
    }
}
