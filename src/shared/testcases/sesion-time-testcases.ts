import { RoleEntity } from '@dale/roles/repositories';
import { SessionTimeAllResponseDto } from '@dale/session-time/dto';
import { SessionTimeEntity } from '@dale/session-time/repositories';

export const sessionTimeRespTest = {
  sessionTime: 1200,
};

export const defaultSessionTimeRespTest = {
  sessionTime: 420,
};

export const createSessionTime = {
  role: 'CallCenter',
  sessionTime: 1200,
};

export const roleFound: RoleEntity = {
  id: 7,
  name: 'CallCenter',
};

export const createSessionTimeResp: SessionTimeEntity = {
  sessionTime: 1200,
  role: roleFound,
  id: 'an Id',
};

export const createSessionTimeWithRole = {
  sessionTime: 1200,
  role: roleFound,
};

export const allSessionTimeResp = [
  new SessionTimeAllResponseDto(createSessionTimeResp),
];

export const updateSessionTime = {
  id: 'an Id',
  sessionTime: 1250,
};
