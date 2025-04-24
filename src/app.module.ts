import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesUploadModule } from './files-upload/files-upload.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), FilesUploadModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
