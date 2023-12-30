import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUserLogin } from '../custom-decorators';
import { OrganizationDto } from './dto';
import { OrganizationsService } from './organizations.service';

@UseGuards(JwtGuard)
@Controller('organizations')
export class OrganizationsController {
    constructor(private organizationService: OrganizationsService){}

    @Post()
    createOrganization(@GetUserLogin('id') userId: string, @Body() dto: OrganizationDto) {
        return this.organizationService.createOrganization(userId, dto);
    }
}
