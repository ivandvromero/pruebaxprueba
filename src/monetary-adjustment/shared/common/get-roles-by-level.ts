import { userLevel } from './user-level';

export const GetRolesByLevel = (level: number): string[] => {
  const roles = Object.entries(userLevel)
    .filter(([_, roleLevel]) => roleLevel === level)
    .map(([role]) => role);

  return roles;
};
