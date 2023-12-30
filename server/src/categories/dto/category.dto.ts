import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    organizationId: string
}

export class EditCategoryDto {

    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    organizationId?: string
}