export enum Entitlement {
  PUBLIC = 'PUBLIC',
  COMMUNITY_MEMBER = 'COMMUNITY_MEMBER',
  ADMIN = 'ADMIN',
}

export function isValidEntitlement(value: unknown): value is Entitlement {
  return (
    value === Entitlement.PUBLIC ||
    value === Entitlement.COMMUNITY_MEMBER ||
    value === Entitlement.ADMIN
  );
}
