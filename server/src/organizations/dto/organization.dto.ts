import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateOrganizationDto {
    
    @IsString()
    @IsNotEmpty()
    name: string
}

export class EditOrganizationDto {

    @IsString()
    @IsOptional()
    name?: string
}