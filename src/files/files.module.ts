import { Module } from '@nestjs/common';
import { File } from './entities/file.entity';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesRepository } from './files.repository';

@Module({
  imports: [TypeOrmModule.forFeature([File, FilesRepository])],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
