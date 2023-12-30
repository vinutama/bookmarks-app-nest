import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationDto } from './dto';

@Injectable()
export class OrganizationsService {
    constructor(private prisma: PrismaService){}

    async createOrganization(userId: string, dto: OrganizationDto) {
        const organization = await this.prisma.organizations.create({
            data: {
                name: dto.name, user: {connect: {id: userId}}
            }
        });

        return organization;
    }
}
