import {
  IDNV_STATUS_PASSED,
  IDNV_STATUS_FAILED,
} from '@dale/shared-nestjs/constants/status';

export const USER_STATUS_MAPPING = {
  [IDNV_STATUS_PASSED]: 'ACTIVE',
  [IDNV_STATUS_FAILED]: 'INACTIVE',
};
