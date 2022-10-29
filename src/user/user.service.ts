import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserData } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, userData: UpdateUserData) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...userData,
      },
    });

    delete user.hash;

    return user;
  }
}
