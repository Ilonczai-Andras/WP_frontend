import { StoryRequestDto } from "../../models/storyRequestDto";

export const TargetAudienceLabels: Record<StoryRequestDto.TargetAudienceEnum, string> = {
  YOUNG_ADULT: 'Young Adult (13-18 years of age)',
  NEW_ADULT: 'New Adult (18-25 years of age)',
  ADULT: 'Adult (25+ years of age)',
};
