import { SessionTimeEntity } from '../repositories';

export class SessionTimeAllResponseDto {
  id: string;
  sessionTime: number;
  rol: string;

  constructor(sessionTimeEntity: SessionTimeEntity) {
    const { id, role, sessionTime } = sessionTimeEntity;
    this.id = id;
    this.sessionTime = sessionTime;
    this.rol = role.name;
  }
}
