import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUserLogin } from '../custom-decorators';
import { CreateOrganizationDto, EditOrganizationDto } from './dto';
import { OrganizationsService } from './organizations.service';

@UseGuards(JwtGuard)
@Controller('organizations')
export class OrganizationsController {
    constructor(private organizationService: OrganizationsService){}

    @Post()
    createOrganization(@GetUserLogin('id') userId: string, @Body() dto: CreateOrganizationDto) {
        return this.organizationService.createOrganization(userId, dto);
    }

    @Get()
    getOrganizations(@GetUserLogin('id') userId: string) {
        return this.organizationService.getOrganizations(userId);
    }

    @Get(':organizationId')
    getOrganizationDetails(
        @GetUserLogin('id') userId: string,
        @Param('organizationId') id: string
    ) {
        return this.organizationService.getOrganizationDetails(userId, id);
    }

    @Patch(':organizationId')
    editOrganization(
        @GetUserLogin('id') userId: string,
        @Param('organizationId') id: string,
        @Body() dto: EditOrganizationDto
    ) {
        return this.organizationService.editOrganization(userId, id, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':organizationId')
    deleteOrganization(
        @GetUserLogin('id') userId: string,
        @Param('organizationId') id: string
    ) {
        return this.organizationService.deleteOrganization(userId, id);
    }

}
