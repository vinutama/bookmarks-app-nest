import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto, EditOrganizationDto } from './dto';

@Injectable()
export class OrganizationsService {
    constructor(private prisma: PrismaService){}

    async createOrganization(userId: string, dto: CreateOrganizationDto) {
        const organization = await this.prisma.organizations.create({
            data: {
                name: dto.name, user: {connect: {id: userId}}
            }
        });

        return organization;
    }

    async getOrganizations(userId: string) {
        return await this.prisma.organizations.findMany({
            where: {
                userId
            }
        });
    }

    async getOrganizationDetails(userId: string, id: string) {
        const result = await this.prisma.organizations.findFirst({
            where: {
                id
            }
        });
        return {message: 'Organization details retrieved', ...result};
    }

    async editOrganization(userId: string, id: string, dto: EditOrganizationDto) {
        const organization = await this.prisma.organizations.findFirst({
            where: {
                id
            },
        });
        if (!organization) throw new NotFoundException('Organization does not exist!');
        if(organization.userId != userId) throw new ForbiddenException('Resource denied');

        return await this.prisma.organizations.update({
            where: {
                id
            },
            data: { ...dto }
        });
    }

    async deleteOrganization(userId: string, id: string) {
        const organization = await this.prisma.organizations.findFirst({
            where: {id},
        });
        if (!organization) throw new NotFoundException('Organization does not exist!');
        if (organization.userId != userId) throw new ForbiddenException('Resource denied');

        return await this.prisma.organizations.delete({
            where: {
                id
            }
        });
    }
}
