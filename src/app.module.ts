import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesUploadModule } from './files-upload/files-upload.module';

@Module({
  imports: [FilesUploadModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
