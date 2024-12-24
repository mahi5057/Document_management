import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { ObjectId } from 'mongodb';

export class UpdateDocumentDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  author: string;
}