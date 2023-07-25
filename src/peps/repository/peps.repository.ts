import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Logger } from '@dale/logger-nestjs';
import { DatabaseService } from '../../shared/db/connection/connection.service';
import { HistoricalEntity } from './historical.entity';
import { config } from '../../shared/config/typeorm.config';
import { IPatchPepDto } from '../shared/interfaces/patch-pep-dto.interface';
import { PepStatus } from '../shared/enums/pep-status.enum';

@Injectable()
export class PepsRepository {
  private pepsDB: Repository<HistoricalEntity>;
  constructor(private dbService: DatabaseService, private logger: Logger) {}

  async onModuleInit() {
    await this.dbService.init(config, process.env.TYPEORM_BACKOFFICE_USERNAME);
    this.pepsDB = this.dbService.getRepository(HistoricalEntity);
    if (process.env.DB_ROTATING_KEY === 'true') {
      setInterval(async () => {
        await this.dbService.init(
          config,
          process.env.TYPEORM_BACKOFFICE_DATABASE,
        );
        this.pepsDB = this.dbService.getRepository(HistoricalEntity);
      }, Number(process.env.DB_CONNECTION_REFRESH_MINUTES) * 60 * 1000);
    }
  }

  async create(payload: any) {
    try {
      const created = this.pepsDB.create(payload);
      await this.pepsDB.save(created);

      return created;
    } catch (error) {
      this.logger.debug(`Error creating new peps: ${error}`);
      throw new BadRequestException('Error al guardar el PEPS');
    }
  }

  async findHistorical(statusLevel: number, status: PepStatus): Promise<any> {
    return await this.pepsDB.find({
      where: {
        statusLevel,
        status,
      },
    });
  }

  async findByIdentification(identification: string) {
    try {
      return await this.pepsDB.findOne({
        where: {
          identification,
        },
      });
    } catch (error) {
      this.logger.debug(
        `El usuario con la identificación: ${identification} no fue encontrado.`,
      );
      throw new NotFoundException(
        `El usuario con la identificación: ${identification} no fue encontrado.`,
      );
    }
  }

  async patchPep(payload: IPatchPepDto): Promise<{ message: string }> {
    try {
      await this.pepsDB.update(
        {
          identification: payload.identification,
        },
        {
          answerDate: payload.answerDate,
          status: payload.status,
          statusLevel: payload.statusLevel,
          comment: payload.comment,
          validatorEmail: payload.validatorEmail,
          approverEmail: payload.approverEmail,
        },
      );

      return {
        message: `Pass to next level ${payload.statusLevel}`,
      };
    } catch (error) {
      this.logger.debug(`Error creating new peps: ${error}`);
      throw new BadRequestException('Error al actualizar el PEP');
    }
  }
}
