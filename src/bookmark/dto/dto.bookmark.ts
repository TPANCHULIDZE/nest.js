import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BookmarkDtoData {
  bookmark: BookmarkData;
}

export class UpdateDtoData {
  bookmark: UpdateBookmarkData;
}

export class BookmarkData {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  link: string;
}

export class UpdateBookmarkData {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  link?: string;
}
