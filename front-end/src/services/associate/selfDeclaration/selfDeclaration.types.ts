
import type { AssociateEducation } from '../associate.types';

export interface SelfDeclarationResponse {
  socialName?: string;
  race?: string;
  gender?: string;
  sexualOrientation?: string;
  education?: AssociateEducation;
  income?: number | null;
  acceptedDataSharingTerm?: boolean;
}

export interface UpdateSelfDeclarationPayload {
  socialName?: string | null;
  race?: string | null;
  gender?: string | null;
  sexualOrientation?: string | null;
  education?: AssociateEducation | null;
  income?: number | null;
  acceptedDataSharingTerm?: boolean;
}
