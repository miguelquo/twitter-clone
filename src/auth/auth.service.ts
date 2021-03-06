import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository, FindOneOptions } from 'typeorm';
import { hash, compare } from 'bcrypt';

import { User } from './entities/user.entity';
import { UserCreate } from './entities/user.create';

@Injectable()
export class AuthService {
   private SALT_ROUNDS: number = 10;

   constructor(
      @InjectRepository(User)
      private readonly userRepo: Repository<User>, // private readonly jwtService: JwtService
   ) {}

   async createUser(user_input: UserCreate): Promise<User> {
      const found = await this.userRepo.findOne({
         username: user_input.username,
      });

      if (found) {
         return null;
      }

      var user: User = user_input as User;

      user.date_joined = new Date().toString();
      user.last_login = new Date().toString();
      user.password = await hash(user.password, this.SALT_ROUNDS);

      return await this.userRepo.save(user);
   }

   async validateUser(username: string, password: string): Promise<any> {
      const user: User = await this.userRepo
         .createQueryBuilder('user')
         .select('*')
         .where('user.username = :username', { username: username })
         .getRawOne();

      if (!user) {
         return null;
      }

      const match = await compare(password, user.password);

      let { phone_number, ...user_public_data } = user;
      user['password'] = null;

      return match ? user_public_data : null;
   }

   /* async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: await this.jwtService.sign(payload),
        };
    }
    */
}
