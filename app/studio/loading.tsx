import { BrandLoadingScreen } from "@/components/brand/brand-loading-screen";

export default function StudioLoading() {
  return (
    <BrandLoadingScreen
      ariaLabel="Loading Studio"
      hint="First load compiles the CMS in the background. Later visits are much faster."
    />
  );
}
