export enum TargetAudienceEnum {
  YOUNG_ADULT = 'Young Adult (13-18 years of age)',
  NEW_ADULT = 'New Adult (18-25 years of age)',
  ADULT = 'Adult (25+ years of age)',
}

export const TargetAudienceLabels: Record<TargetAudienceEnum, string> = {
  [TargetAudienceEnum.YOUNG_ADULT]: 'Young Adult (13-18 years of age)',
  [TargetAudienceEnum.NEW_ADULT]: 'New Adult (18-25 years of age)',
  [TargetAudienceEnum.ADULT]: 'Adult (25+ years of age)',
};
