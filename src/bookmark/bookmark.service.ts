import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookmarkData, UpdateBookmarkData } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
    return bookmarks;
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    return bookmark;
  }

  async createBookmark(userId: number, bookmarkData: BookmarkData) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...bookmarkData,
      },
    });
    return bookmark;
  }

  async updateBookmarkById(
    userId: number,
    bookmarkId: number,
    bookmarkData: UpdateBookmarkData,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('You can not have access');

    const updatedBookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...bookmarkData,
      },
    });

    return updatedBookmark;
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('You can not have access');

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });

    return { msg: 'Bookmark delete successfully' };
  }
}
