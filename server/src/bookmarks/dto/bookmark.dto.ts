import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBookmarkDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    link: string

    @IsString()
    @IsOptional()
    description?: string

    @IsOptional()
    categoryId?: number
}

export class EditBookmarkDto {
    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    link?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsOptional()
    categoryId?: number
}