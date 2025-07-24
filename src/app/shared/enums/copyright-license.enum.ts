export enum CopyrightLicenseEnum {
  ALL_RIGHTS_RESERVED = 'All Rights Reserved',
  PUBLIC_DOMAIN = 'Public Domain',
  CREATIVE_COMMONS_ATTRIBUTION = 'Creative Commons (CC) Attribution',
  CREATIVE_COMMONS_ATTRIBUTION_NON_COMMERCIAL = 'Creative Commons (CC) Attrib. NonCommercial',
  CREATIVE_COMMONS_ATTRIBUTION_NON_COMMERCIAL_NO_DERIVS = 'Creative Commons (CC) Attrib. NonComm. NoDerivs',
  CREATIVE_COMMONS_ATTRIBUTION_NON_COMMERCIAL_SHARE_ALIKE = 'Creative Commons (CC) Attrib. NonComm. ShareAlike',
  CREATIVE_COMMONS_ATTRIBUTION_SHARE_ALIKE = 'Creative Commons (CC) Attribution-ShareAlike',
  CREATIVE_COMMONS_ATTRIBUTION_NO_DERIVS = 'Creative Commons (CC) Attribution-NoDerivs',
}

export const CopyrightLicenseLabels: Record<CopyrightLicenseEnum, string> = {
  [CopyrightLicenseEnum.ALL_RIGHTS_RESERVED]: 'All Rights Reserved',
  [CopyrightLicenseEnum.PUBLIC_DOMAIN]: 'Public Domain',
  [CopyrightLicenseEnum.CREATIVE_COMMONS_ATTRIBUTION]: 'Creative Commons (CC) Attribution',
  [CopyrightLicenseEnum.CREATIVE_COMMONS_ATTRIBUTION_NON_COMMERCIAL]: 'Creative Commons (CC) Attrib. NonCommercial',
  [CopyrightLicenseEnum.CREATIVE_COMMONS_ATTRIBUTION_NON_COMMERCIAL_NO_DERIVS]: 'Creative Commons (CC) Attrib. NonComm. NoDerivs',
  [CopyrightLicenseEnum.CREATIVE_COMMONS_ATTRIBUTION_NON_COMMERCIAL_SHARE_ALIKE]: 'Creative Commons (CC) Attrib. NonComm. ShareAlike',
  [CopyrightLicenseEnum.CREATIVE_COMMONS_ATTRIBUTION_SHARE_ALIKE]: 'Creative Commons (CC) Attribution-ShareAlike',
  [CopyrightLicenseEnum.CREATIVE_COMMONS_ATTRIBUTION_NO_DERIVS]: 'Creative Commons (CC) Attribution-NoDerivs',
};

