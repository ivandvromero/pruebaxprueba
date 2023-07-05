import { Injectable, Optional } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { ErrorCodesEnum } from '../../shared/code-erros/error-codes.enum';
import {
  BadRequestExceptionDale,
  CustomException,
  InternalServerExceptionDale,
  NotFoundExceptionDale,
} from '@dale/manage-errors-nestjs';
import {
  UpdateLocateDto,
  UpdateLocateUserResponse,
} from '../../modules/user/dto/update-locate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@dale/logger-nestjs';

@Injectable()
export class UserDbService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Optional() private logger?: Logger,
  ) {}

  async createUser(user: User): Promise<User> {
    return await this.userRepository.save(user).catch((error: any) => {
      throw new InternalServerExceptionDale(ErrorCodesEnum.MUS009, error);
    });
  }

  async findUserById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUserByEmail(
    email: string,
    userDetails: Partial<User>,
  ): Promise<UpdateResult> {
    return this.userRepository
      .update({ email }, userDetails)
      .catch((error: any) => {
        throw new BadRequestExceptionDale(ErrorCodesEnum.MUS014, error);
      });
  }

  async updateUserById(
    id: string,
    userDetails: Partial<User>,
  ): Promise<UpdateResult> {
    return this.userRepository
      .update({ id }, userDetails)
      .catch((error: any) => {
        throw new BadRequestExceptionDale(ErrorCodesEnum.MUS016, error);
      });
  }

  async findUserByEmail(email: string): Promise<User> {
    const result = await this.userRepository.findOne({ where: { email } });
    if (result) {
      const { dob } = result;
      if (dob) {
        const dobDateOnly: any = new Date(dob).toISOString().split('T')[0];
        return { ...result, dob: dobDateOnly };
      }
    }
    return result;
  }

  async isDbConnectionAlive(): Promise<boolean | string> {
    try {
      const query =
        'SELECT COLUMN_NAME  FROM information_schema.COLUMNS LIMIT 1';
      await this.userRepository.query(query);
      return true;
    } catch (error) {
      this.logger?.error(`Error - ${error}`);
      return error.message;
    }
  }

  async findUserByPhoneNumber(phoneNumber: string): Promise<User> {
    let result;
    try {
      result = await this.userRepository.findOne({
        relations: [],
        where: { phoneNumber: phoneNumber },
      });
      return result;
    } catch (error) {
      console.error(error);
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS005, error);
    }
  }

  async findUserByDocumentNumber(documentNumber: string) {
    let result;
    try {
      result = await this.userRepository.findOne({
        relations: [],
        where: { documentNumber },
      });
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS005, error);
    }
    return result;
  }
  async updateCityAndDepartamentByPhoneNumber(
    phoneNumber: string,
    updateLocation: UpdateLocateDto,
  ): Promise<UpdateLocateUserResponse> {
    try {
      const user = await this.findUserByPhoneNumber(phoneNumber);
      if (!user) {
        throw new NotFoundExceptionDale(
          ErrorCodesEnum.MUS019,
          'user does not exist',
        );
      }
      await this.userRepository.update(
        { phoneNumber },
        { department: updateLocation.departament, city: updateLocation.city },
      );
      return { message: 'Usuario actualizado correctamente' };
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MUS020, error);
    }
  }
  async locationRequired(userId: string): Promise<boolean> {
    try {
      const user = await this.findUserById(userId);
      if (!user) {
        throw new NotFoundExceptionDale(
          ErrorCodesEnum.MUS023,
          'user does not exist',
        );
      }
      return user.city === null;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MUS024, error);
    }
  }
}
