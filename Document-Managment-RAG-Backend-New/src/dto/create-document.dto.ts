import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CreateDocumentDto {
  @IsUrl()
  @IsNotEmpty()
  contentUrl: string;

  @IsString()
  @IsNotEmpty()
  fileType: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  userId: ObjectId;

  originalName: string;
}
