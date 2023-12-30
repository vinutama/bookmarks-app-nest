import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { CategoriesModule } from './categories/categories.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    BookmarksModule, 
    PrismaModule, 
    ConfigModule.forRoot({isGlobal: true}), CategoriesModule, OrganizationsModule],
})
export class AppModule {}
