import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibraryModule } from './library/library.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Member } from './library/domain/entities/members.entity';
import { Borrow } from './library/domain/entities/borrow.entity';
import { Book } from './library/domain/entities/book.entity';

@Module({
  imports: [
    LibraryModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'library',
      entities: [Member, Book, Borrow],
      synchronize: process.env.DEVMODE == "true" || false
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
