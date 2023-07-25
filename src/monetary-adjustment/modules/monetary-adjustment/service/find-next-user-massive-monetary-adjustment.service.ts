import { UseWorkBalancerService } from '@dale/user-work-balancer/modules/services/use-work-balancer.service';
import { Injectable, Optional } from '@nestjs/common';
import { Logger } from 'typeorm';
import { GetRolesByLevel } from '@dale/monetary-adjustment/shared/common/get-roles-by-level';
import { MonetaryAdjustmentEntityOrm } from '@dale/monetary-adjustment/repositories/monetary-adjustment/monetary-adjustment.entity';
import { FindRolesByCodesService } from '@dale/roles/services';

@Injectable()
export class FindNextUserMassiveMonetaryAdjustmentService {
  constructor(
    @Optional() private logger: Logger,
    private readonly useWorkBalancerService: UseWorkBalancerService,
    private readonly findRolesByCodesService: FindRolesByCodesService,
  ) {}
  async run(
    adjustments: MonetaryAdjustmentEntityOrm[],
    transactionLevel: number,
  ): Promise<string> {
    const codes = adjustments.map((adjustment) => adjustment.transactionCode);
    const roles = await this.findRolesByCodesService.run(codes);
    const rolesByLevel = GetRolesByLevel(transactionLevel);
    const nextRole = rolesByLevel.filter((rol) => roles.includes(rol));
    const emails = await this.useWorkBalancerService.getRandomEmail(nextRole);
    const { email } = emails;
    return email;
  }
}
