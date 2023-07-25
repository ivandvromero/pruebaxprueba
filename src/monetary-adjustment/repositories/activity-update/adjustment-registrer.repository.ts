import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../../../shared/db/connection/connection.service';
import { config } from '../../../shared/config/typeorm.config';
import { MonetaryAdjustmentEntityOrm } from './update-adjustment-register.entity';
import { Between, Repository } from 'typeorm';
import { GetAdjustmentQueryReportsDto } from '../../modules/monetary-adjustment/dto/get-adjustment-reports.dto';
import { PaginationRegisterAdjustmentsResponse } from '../../shared/common/get-adjustment-registrer-response';
import { Logger } from '@dale/logger-nestjs';
import { NotFoundException } from '@dale/exceptions//custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions//code-errors/error-codes.enum';

@Injectable()
export class AdjustmentsRegisterRepository implements OnModuleInit {
  private monetaryAdjustmentsDB: Repository<MonetaryAdjustmentEntityOrm>;
  constructor(private dbService: DatabaseService, private logger: Logger) {}
  async onModuleInit() {
    await this.dbService.init(config, process.env.TYPEORM_BACKOFFICE_USERNAME);
    this.monetaryAdjustmentsDB = this.dbService.getRepository(
      MonetaryAdjustmentEntityOrm,
    );
    if (process.env.DB_ROTATING_KEY === 'true') {
      setInterval(async () => {
        await this.dbService.init(
          config,
          process.env.TYPEORM_BACKOFFICE_DATABASE,
        );
        this.monetaryAdjustmentsDB = this.dbService.getRepository(
          MonetaryAdjustmentEntityOrm,
        );
      }, Number(process.env.DB_CONNECTION_REFRESH_MINUTES) * 60 * 1000);
    }
  }

  async isDbConnectionAlive(): Promise<boolean | string> {
    return this.dbService.isDbConnectionAlive();
  }

  async findAll(
    getAdjustmentQueryReportsDto: GetAdjustmentQueryReportsDto,
  ): Promise<PaginationRegisterAdjustmentsResponse> {
    const { limit = 0, offset = 0 } = getAdjustmentQueryReportsDto;
    const {
      transactionCode,
      adjustmentType,
      fromFile,
      depositNumber,
      initialDate,
      endDate,
    } = getAdjustmentQueryReportsDto;

    const where = {
      transactionCode: transactionCode || undefined,
      adjustmentType: adjustmentType || undefined,
      isFromFile: fromFile || undefined,
      depositNumber: depositNumber || undefined,
      createdAt:
        initialDate && endDate ? Between(initialDate, endDate) : undefined,
    };

    const filteredWhere = Object.entries(where)
      .filter(([key, value]) => value !== undefined)
      .reduce((acc, [key, value]) => {
        return { ...acc, [key]: value };
      }, {});

    try {
      const adjustments = await this.monetaryAdjustmentsDB.find({
        order: {
          createdAt: 'DESC',
        },
        where: filteredWhere,
        skip: offset * limit,
        take: limit,
        relations: { updateRegister: true },
      });
      const count = await this.monetaryAdjustmentsDB.count({
        where: filteredWhere,
      });
      return new PaginationRegisterAdjustmentsResponse(
        adjustments,
        limit,
        offset,
        count,
      );
    } catch (error) {
      this.logger.debug(error);
      throw new NotFoundException(
        ErrorCodesEnum.BOS004,
        'Error al intentar obtener los ajustes monetarios.',
      );
    }
  }
}
