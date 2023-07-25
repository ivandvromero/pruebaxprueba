import { UseWorkBalancerService } from '@dale/user-work-balancer/modules/services/use-work-balancer.service';
import { Injectable, Optional } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { TransactionCodeService } from '../../../../transaction-codes/services/transaction-codes.service';
import { GetRolesByLevel } from '@dale/monetary-adjustment/shared/common/get-roles-by-level';

@Injectable()
export class FindNextUserSingleMonetaryAdjustmentService {
  constructor(
    @Optional() private logger: Logger,
    private readonly transactionCodeService: TransactionCodeService,
    private readonly useWorkBalancerService: UseWorkBalancerService,
  ) {}

  async run(transactionCode: string, level: number): Promise<string> {
    this.logger.debug('Find next user service started');
    const rolesByLevel = GetRolesByLevel(level);
    const roles = await this.transactionCodeService.getRolesByCode(
      transactionCode,
    );
    const nextRole = rolesByLevel.filter((rol) => roles.includes(rol));
    const emails = await this.useWorkBalancerService.getRandomEmail(nextRole);
    const { email } = emails;
    return email;
  }
}
