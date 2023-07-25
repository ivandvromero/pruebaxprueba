import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { DatabaseService } from '../../../shared/db/connection/connection.service';
import { Repository } from 'typeorm';
import { RoleEntity } from './role.entity';
import { IRolesDto } from '../../shared/interfaces/role-type';
import {
  IFindCodeByRoleResponse,
  IRoleResponse,
} from '../../shared/interfaces/role-response.interface';
import { config } from '../../../shared/config/typeorm.config';
import { BadRequestException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';

@Injectable()
export class RoleRepository {
  private roleDB: Repository<RoleEntity>;
  constructor(private dbService: DatabaseService, private logger: Logger) {}

  async onModuleInit() {
    await this.dbService.init(config, process.env.TYPEORM_BACKOFFICE_USERNAME);
    this.roleDB = this.dbService.getRepository(RoleEntity);
    if (process.env.DB_ROTATING_KEY === 'true') {
      setInterval(async () => {
        await this.dbService.init(
          config,
          process.env.TYPEORM_BACKOFFICE_DATABASE,
        );
        this.roleDB = this.dbService.getRepository(RoleEntity);
      }, Number(process.env.DB_CONNECTION_REFRESH_MINUTES) * 60 * 1000);
    }
  }

  async createRole(role: IRolesDto): Promise<IRoleResponse> {
    try {
      const createRole = this.roleDB.create(role);
      await this.roleDB.save(createRole);

      this.logger.debug(`createRole.repository saving an role: ${role}`);

      return createRole;
    } catch (error) {
      this.logger.debug(`createRole.repository new error: ${error}`);
      throw new NotFoundException('Error al crear el rol');
    }
  }

  async findRoles(): Promise<IRoleResponse[]> {
    const data = await this.roleDB.find();
    return data;
  }

  async findCodesByRole(filter: string): Promise<IFindCodeByRoleResponse> {
    const roles: any = await this.roleDB.find({
      relations: { codes: true },
    });

    if (filter === 'OperationalLeader') {
      const { id, __codes__: codes } = roles[0];

      return { id, name: 'OperationalLeader', codes };
    }

    const filteredRoles = roles.filter((role) => role.name === filter);

    if (filteredRoles.length === 0) {
      throw new NotFoundException('No se encontraron códigos para ese rol.');
    }

    const { id, name, __codes__: codes } = filteredRoles[0];

    return { id, name, codes };
  }

  async findRolesByCodes(codes: string[]): Promise<string[]> {
    const foundRoles = await this.roleDB.find({
      where: {
        codes: codes.map((code) => ({ code })),
      },
      relations: ['codes'],
    });

    const filteredRolesWithCodes = foundRoles.map((roles: any) => {
      const rol = roles.name;
      const codes = roles.__codes__.map((code) => code.code);
      return {
        rol,
        codes,
      };
    });

    const filteredRoles = filteredRolesWithCodes.filter((obj) => {
      return codes.every((code) => obj.codes.includes(code));
    });

    const roles = filteredRoles.map((item) => item.rol);

    return roles;
  }

  async findRole(role: string): Promise<RoleEntity> {
    try {
      return await this.roleDB.findOne({
        where: { name: role },
      });
    } catch (error) {
      this.logger.error(error?.message);
      throw new BadRequestException(
        ErrorCodesEnum.BOS039,
        'Error al buscar el rol.',
      );
    }
  }
}
