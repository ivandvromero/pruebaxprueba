import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Logger } from '@dale/logger-nestjs';
import { TransactionCodesEntity } from './transaction-codes.entity';
import { NotFoundException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';
import { FindRolesService } from '@dale/roles/services';
import { DatabaseService } from '@dale/db/connection/connection.service';
import {
  ITransactionCodeInsert,
  ITransactionCodeResponse,
  TransactionCodeDto,
} from '../..';
import { config } from '../../../shared/config/typeorm.config';

@Injectable()
export class TransactionCodesRepository {
  private transactionCodeDB: Repository<TransactionCodesEntity>;
  constructor(
    private dbService: DatabaseService,
    private logger: Logger,
    private roleService: FindRolesService,
  ) {}

  async onModuleInit() {
    await this.dbService.init(config, process.env.TYPEORM_BACKOFFICE_USERNAME);
    this.transactionCodeDB = this.dbService.getRepository(
      TransactionCodesEntity,
    );
    if (process.env.DB_ROTATING_KEY === 'true') {
      setInterval(async () => {
        await this.dbService.init(
          config,
          process.env.TYPEORM_BACKOFFICE_DATABASE,
        );
        this.transactionCodeDB = this.dbService.getRepository(
          TransactionCodesEntity,
        );
      }, Number(process.env.DB_CONNECTION_REFRESH_MINUTES) * 60 * 1000);
    }
  }

  async createTransactionCode(
    transactionCode: TransactionCodeDto,
  ): Promise<TransactionCodesEntity> {
    try {
      const createTransactionCode = await this.transactionCodeDB.create(
        transactionCode,
      );
      const saved = await this.transactionCodeDB.save(createTransactionCode);
      this.logger.debug(
        `createTransactionCode.repository saving an role: ${transactionCode}`,
      );

      return saved;
    } catch (error) {
      this.logger.debug(`createTransactionCode.repository new error: ${error}`);
      throw new BadRequestException(
        'Ocurrió un error al crear el código de transacción',
      );
    }
  }

  async insertManyTransactionCodes(
    transactionCodes: ITransactionCodeInsert[],
  ): Promise<ITransactionCodeResponse> {
    try {
      const created = await this.transactionCodeDB
        .createQueryBuilder()
        .insert()
        .into(TransactionCodesEntity)
        .values(transactionCodes)
        .returning('*')
        .execute();

      this.logger.debug(
        `insertManyTransactionCodes.repository saving many transaction codes: ${transactionCodes.map(
          (txCode) => txCode.code,
        )}`,
      );

      const roles = await this.roleService.run();

      const objectRoles = {};
      roles.forEach((role) => {
        objectRoles[role.name] = role.id;
      });

      const relations = {};
      transactionCodes.forEach((code) => {
        relations[code.code] = code.roles.map((role) => objectRoles[role]);
      });

      for (const code of transactionCodes) {
        if (relations[code.code].length > 0) {
          await this.transactionCodeDB
            .createQueryBuilder()
            .relation(TransactionCodesEntity, 'roles')
            .of(code.id)
            .add(relations[code.code]);
        }
      }

      return created.generatedMaps ?? created.raw;
    } catch (error) {
      this.logger.debug(
        `insertManyTransactionCodes.repository new error: ${error}`,
      );
      throw new BadRequestException(
        'Ocurrió un error al crear masivamente los códigos de transacción',
      );
    }
  }

  async getDescriptionCode(code: string): Promise<string> {
    try {
      const respCode = await this.transactionCodeDB.findOneBy({ code });
      if (!respCode) {
        throw new BadRequestException('No se ha encontrado el codigo');
      }
      const toReplace = `${code} - `;
      return respCode.description.replace(toReplace, '');
    } catch (error) {
      return 'No se ha encontrado el código';
    }
  }

  async getRolesByCode(code: string): Promise<string[]> {
    this.logger.debug('Get roles by code repository started');
    const codes = await this.transactionCodeDB.findOne({
      where: {
        code,
      },
      relations: { roles: true },
    });
    if (!codes) {
      throw new NotFoundException(
        ErrorCodesEnum.BOS025,
        'El código del ajuste monetario no se ha encontrado en la base de datos.',
      );
    }
    const roles = codes.roles.map((rol) => rol.name);
    return roles;
  }

  async deleteManyTransactionCodes(): Promise<boolean> {
    const queryRunner = this.dbService.queryRunner;
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.query(`DELETE FROM code_role`);
      await queryRunner.query(`DELETE FROM codes`);
      await queryRunner.commitTransaction();
      return true;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return false;
    }
  }
}
