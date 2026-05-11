export function formatProjectScope(services: string[] = []) {
  const cleanedServices = services
    .map((service) => service.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (cleanedServices.length === 0) return "home renovation";
  if (cleanedServices.length === 1) return cleanedServices[0];
  return `${cleanedServices[0]} and ${cleanedServices[1]}`;
}

export function buildImageAltText(
  cmsAltText: string | undefined,
  projectTitle: string,
  projectServices: string[] | undefined,
  projectLocation?: string,
) {
  const trimmedAltText = cmsAltText?.trim();
  if (trimmedAltText) return trimmedAltText;
  const scope = formatProjectScope(projectServices);
  return `${scope} by ${projectTitle}${projectLocation ? ` in ${projectLocation}` : " in London"}`;
}
