import { Entitlement } from './entitlement';

export interface PublicUser {
  id: string;
  email: string;
  entitlement: Entitlement;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export type IdentityState =
  | {
      isAuthenticated: false;
      user: null;
      entitlement: Entitlement.PUBLIC;
    }
  | {
      isAuthenticated: true;
      user: PublicUser;
      entitlement: Entitlement;
    };
