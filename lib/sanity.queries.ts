import groq from "groq";
import type { Image } from "sanity";

import { sortGalleryCategoriesAlphabetically } from "./gallery-category-sort";
import {
  sanityClient,
  sanityConfigured,
  sanityFetchOptions,
  sanityPreviewClient,
} from "./sanity.client";
import { urlFor } from "@/src/sanity/lib/imageHelpers";

export type SanityImage = {
  _type: "image";
  alt?: string;
  asset: {
    _ref: string;
    _type: "reference";
    metadata?: {
      lqip?: string;
    };
  };
};

export type PortableTextBlock = {
  _key: string;
  _type: string;
  [key: string]: unknown;
};

export type GalleryCategory = {
  _id: string;
  title: string;
  slug: string;
};

export type Project = {
  _id: string;
  title: string;
  slug?: string;
  startDate?: string;
  endDate?: string;
  featuredImage?: SanityImage | null;
  galleryCategories?: GalleryCategory[];
  images: SanityImage[];
  description: PortableTextBlock[];
  projectLocation?: string;
  projectValue?: number;
  services: string[];
};

export type GalleryProject = {
  _id: string;
  slug: string | null;
  title: string;
  projectLocation?: string;
  projectValue?: number;
  services: string[];
  image: SanityImage | null;
};

/** One row on the gallery / projects grid: links to `/projects/[slug]`. */
export type GalleryProjectCard = {
  _id: string;
  slug: string;
  title: string;
  projectLocation?: string;
  projectValue?: number;
  services: string[];
  galleryCategories: GalleryCategory[];
  cardImage: SanityImage | null;
};

export type ProjectDetail = {
  _id: string;
  slug: string;
  title: string;
  _updatedAt?: string;
  startDate?: string;
  endDate?: string;
  projectLocation?: string;
  projectValue?: number;
  services: string[];
  description: PortableTextBlock[];
  featuredImage: SanityImage | null;
  /** Optional “before” paired with featured “after” on the project page. */
  beforeImage: SanityImage | null;
  /** When true and both images exist, UI uses a comparison slider; otherwise side-by-side. */
  beforeAfterAligned: boolean;
  images: SanityImage[];
  galleryCategories?: GalleryCategory[];
};

export type GalleryImageItem = {
  _id: string;
  projectId: string;
  projectTitle: string;
  projectLocation?: string;
  projectValue?: number;
  services: string[];
  galleryCategories: GalleryCategory[];
  image: SanityImage;
};

export type Testimonial = {
  _id: string;
  clientName: string;
  jobTitle: string;
  rating: number;
  createdAt?: string;
  content: string;
};

const allProjectsQuery = groq`*[_type == "project"] | order(_createdAt desc){
  _id,
  title,
  "slug": slug.current,
  startDate,
  endDate,
  featuredImage{
    ...,
    asset->{
      _id,
      metadata{
        lqip
      }
    }
  },
  galleryCategories[]{
    "_id": _key,
    title,
    "slug": slug.current
  },
  images,
  description,
  projectLocation,
  projectValue,
  services
}`;

const siteSettingsHomepageHeroQuery = groq`coalesce(
  *[_id == "siteSettings"][0],
  *[_type == "siteSettings"] | order(select(_id == "siteSettings" => 0, 1) asc, coalesce(_updatedAt, _createdAt) desc)[0]
) {
  heroSectionImage{
    _type,
    alt,
    asset->{
      _id,
      metadata{
        lqip
      }
    }
  },
  heroSectionImageMobile{
    _type,
    alt,
    asset->{
      _id,
      metadata{
        lqip
      }
    }
  }
}
`;

const siteSettingsHomepageFeaturedQuery = groq`coalesce(
  *[_id == "siteSettings"][0],
  *[_type == "siteSettings"] | order(select(_id == "siteSettings" => 0, 1) asc, coalesce(_updatedAt, _createdAt) desc)[0]
) {
  "useManual": coalesce(chooseHomepageProjectManually, false),
  "featured": homepageFeaturedProject->{
    _id,
    "slug": slug.current,
    title,
    projectLocation,
    projectValue,
    services,
    "image": select(
      defined(featuredImage.asset) => featuredImage{
        ...,
        asset->{
          _id,
          metadata{
            lqip
          }
        }
      },
      defined(images[0].asset) => images[0]{
        ...,
        asset->{
          _id,
          metadata{
            lqip
          }
        }
      }
    )
  }
}
`;

const latestProjectsForGalleryQuery = groq`*[_type == "project"] | order(_createdAt desc)[0...6]{
  _id,
  "slug": slug.current,
  title,
  projectLocation,
  projectValue,
  services,
  "image": select(
    defined(featuredImage.asset) => featuredImage{
      ...,
      asset->{
        _id,
        metadata{
          lqip
        }
      }
    },
    defined(images[0].asset) => images[0]{
      ...,
      asset->{
        _id,
        metadata{
          lqip
        }
      }
    }
  )
}`;

const galleryProjectsRowQuery = groq`*[_type == "project" && defined(slug.current)] | order(_createdAt desc)[0...6]{
  _id,
  "slug": slug.current,
  title,
  projectLocation,
  projectValue,
  services,
  featuredImage{
    ...,
    asset->{
      _id,
      metadata{
        lqip
      }
    }
  },
  galleryCategories[]{
    "_id": _key,
    title,
    "slug": slug.current
  },
  "images": images[]{
    ...,
    asset->{
      _id,
      metadata{
        lqip
      }
    }
  }
}`;

const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0]{
  _id,
  _updatedAt,
  "slug": slug.current,
  title,
  startDate,
  endDate,
  projectLocation,
  projectValue,
  services,
  galleryCategories[]{
    "_id": _key,
    title,
    "slug": slug.current
  },
  description,
  beforeAfterAligned,
  beforeImage{
    ...,
    asset->{
      _id,
      metadata{
        lqip
      }
    }
  },
  featuredImage{
    ...,
    asset->{
      _id,
      metadata{
        lqip
      }
    }
  },
  "images": images[]{
    ...,
    asset->{
      _id,
      metadata{
        lqip
      }
    }
  }
}`;

const allProjectSlugsQuery = groq`*[_type == "project" && defined(slug.current)].slug.current`;

const projectSitemapEntriesQuery = groq`*[_type == "project" && defined(slug.current)]{
  "slug": slug.current,
  _updatedAt
}`;

const allTestimonialsQuery = groq`*[_type == "testimonial"] | order(_createdAt desc){
  _id,
  clientName,
  jobTitle,
  rating,
  "createdAt": _createdAt,
  content
}`;

type GalleryImageFromGroq = SanityImage & {
  _key?: string;
  galleryCategories?: Array<{
    _id: string;
    title: string;
    slug: string | null;
  }> | null;
};

type ProjectRowForGallery = {
  _id: string;
  slug: string | null;
  title: string;
  projectLocation?: string;
  projectValue?: number;
  services?: string[];
  featuredImage?: (SanityImage & { asset?: SanityImage["asset"] }) | null;
  galleryCategories?: Array<{
    _id: string;
    title: string;
    slug: string | null;
  }> | null;
  images: GalleryImageFromGroq[] | null;
};

function normalizeResolvedCategories(
  raw: Array<{ _id?: string; title?: string; slug: string | null }> | null | undefined,
): GalleryCategory[] {
  return (
    raw?.filter(
      (c): c is GalleryCategory =>
        Boolean(c?._id && typeof c.slug === "string" && c.slug.length > 0 && c.title),
    ) ?? []
  );
}

function projectGalleryCategories(project: ProjectRowForGallery): GalleryCategory[] {
  return normalizeResolvedCategories(project.galleryCategories);
}

/** Unique filter tags across projects, sorted A–Z (replaces the old galleryCategory document list). */
function deriveGalleryCategoriesFromProjects(
  projects: ProjectRowForGallery[],
): GalleryCategory[] {
  const bySlug = new Map<string, GalleryCategory>();

  for (const project of projects) {
    for (const tag of projectGalleryCategories(project)) {
      if (!bySlug.has(tag.slug)) {
        bySlug.set(tag.slug, tag);
      }
    }
  }

  return sortGalleryCategoriesAlphabetically(Array.from(bySlug.values()));
}

function stripImageFields(img: GalleryImageFromGroq): SanityImage {
  const { _key, ...rest } = img;
  void _key;
  return rest as SanityImage;
}

function pickCardImage(project: ProjectRowForGallery): SanityImage | null {
  if (project.featuredImage?.asset) {
    return stripImageFields(project.featuredImage as GalleryImageFromGroq);
  }
  const first = project.images?.find((img) => Boolean(img?.asset));
  return first ? stripImageFields(first) : null;
}

function toGalleryProjectCards(projects: ProjectRowForGallery[]): GalleryProjectCard[] {
  return projects
    .filter((p) => typeof p.slug === "string" && p.slug.length > 0)
    .map((project) => ({
      _id: project._id,
      slug: project.slug as string,
      title: project.title,
      projectLocation: project.projectLocation,
      projectValue: project.projectValue,
      services: project.services ?? [],
      galleryCategories: projectGalleryCategories(project),
      cardImage: pickCardImage(project),
    }))
    .filter((card) => card.cardImage !== null);
}

function galleryImagesFromProjects(projects: ProjectRowForGallery[]): GalleryImageItem[] {
  return projects.flatMap((project) => {
    const projectCats = projectGalleryCategories(project);

    return (project.images ?? [])
      .filter((img) => Boolean(img?.asset))
      .map((img, index) => ({
        _id: `${project._id}-${index}`,
        projectId: project._id,
        projectTitle: project.title,
        projectLocation: project.projectLocation,
        projectValue: project.projectValue,
        services: project.services ?? [],
        galleryCategories: projectCats,
        image: stripImageFields(img as GalleryImageFromGroq),
      }));
  });
}

async function fetchGalleryProjectRows(): Promise<ProjectRowForGallery[]> {
  return sanityClient.fetch<ProjectRowForGallery[]>(
    galleryProjectsRowQuery,
    {},
    sanityFetchOptions(),
  );
}

export async function getAllProjects() {
  if (!sanityConfigured) {
    return [];
  }
  return sanityClient.fetch<Project[]>(allProjectsQuery, {}, sanityFetchOptions());
}

export async function getAllTestimonials() {
  if (!sanityConfigured) {
    return [];
  }
  return sanityClient.fetch<Testimonial[]>(allTestimonialsQuery, {}, sanityFetchOptions());
}

type SiteSettingsFeaturedRow = {
  useManual: boolean;
  featured: {
    _id: string;
    slug: string | null;
    title: string;
    projectLocation?: string;
    projectValue?: number;
    services?: string[];
    image: (SanityImage & { asset?: SanityImage["asset"] }) | null;
  } | null;
} | null;

type HomepageSettingsFetchOptions = {
  client: typeof sanityClient;
  useDraftPreview: boolean;
};

function getHomepageSettingsFetchOptions(): HomepageSettingsFetchOptions | null {
  if (!sanityConfigured) return null;
  const previewClient =
    process.env.NODE_ENV === "development" ? sanityPreviewClient : null;
  return {
    client: previewClient ?? sanityClient,
    useDraftPreview: previewClient !== null,
  };
}

function homepageSettingsFetchParams(useDraftPreview: boolean) {
  return {
    ...sanityFetchOptions(["homepage"]),
    ...(useDraftPreview
      ? { perspective: "previewDrafts" as const, cache: "no-store" as const }
      : {}),
  };
}

function imageHasAsset(image: unknown): image is SanityImage & { asset: NonNullable<SanityImage["asset"]> } {
  if (!image || typeof image !== "object") return false;
  const asset = (image as SanityImage).asset;
  return Boolean(asset && (asset._ref || (asset as { _id?: string })._id));
}

function buildHeroImageUrl(image: unknown, width: number): string | undefined {
  if (!imageHasAsset(image)) return undefined;
  return urlFor(image as Image).width(width).quality(85).auto("format").url();
}

export type HomepageHeroBackgrounds = {
  desktop: string;
  mobile: string;
};

export async function getHomepageHeroBackgrounds(): Promise<HomepageHeroBackgrounds | null> {
  const fetchOpts = getHomepageSettingsFetchOptions();
  if (!fetchOpts) return null;

  const row = await fetchOpts.client.fetch<{
    heroSectionImage?: unknown;
    heroSectionImageMobile?: unknown;
  } | null>(siteSettingsHomepageHeroQuery, {}, homepageSettingsFetchParams(fetchOpts.useDraftPreview));

  const desktop = buildHeroImageUrl(row?.heroSectionImage, 1920);
  if (!desktop) return null;

  const mobile = buildHeroImageUrl(row?.heroSectionImageMobile, 1080) ?? desktop;
  return { desktop, mobile };
}

export async function getHomepageFeaturedProjectFromSettings(): Promise<GalleryProject | null> {
  const fetchOpts = getHomepageSettingsFetchOptions();
  if (!fetchOpts) {
    return null;
  }
  const row = await fetchOpts.client.fetch<SiteSettingsFeaturedRow | null>(
    siteSettingsHomepageFeaturedQuery,
    {},
    homepageSettingsFetchParams(fetchOpts.useDraftPreview),
  );
  if (!row?.useManual) {
    return null;
  }
  const p = row.featured;
  if (!p?.image?.asset || typeof p.slug !== "string" || p.slug.length === 0) {
    return null;
  }
  return {
    _id: p._id,
    slug: p.slug,
    title: p.title,
    projectLocation: p.projectLocation,
    projectValue: p.projectValue,
    services: p.services ?? [],
    image: p.image as SanityImage,
  };
}

export async function getLatestProjectsForGallery() {
  if (!sanityConfigured) {
    return [];
  }
  return sanityClient.fetch<GalleryProject[]>(
    latestProjectsForGalleryQuery,
    {},
    sanityFetchOptions(),
  );
}

export async function getLatestGalleryImages() {
  if (!sanityConfigured) {
    return [];
  }

  const projects = await fetchGalleryProjectRows();
  return galleryImagesFromProjects(projects);
}

export async function getGalleryFilterData(): Promise<{
  categories: GalleryCategory[];
  projects: GalleryProjectCard[];
}> {
  if (!sanityConfigured) {
    return { categories: [], projects: [] };
  }

  const projects = await fetchGalleryProjectRows();
  const categories = deriveGalleryCategoriesFromProjects(projects);

  return {
    categories,
    projects: toGalleryProjectCards(projects),
  };
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  if (!sanityConfigured || !slug) {
    return null;
  }
  const doc = await sanityClient.fetch<ProjectDetail | null>(
    projectBySlugQuery,
    { slug },
    sanityFetchOptions(),
  );
  if (!doc?.slug) return null;
  const images = (doc.images ?? []).filter((img) => Boolean(img?.asset)) as SanityImage[];
  const featured =
    doc.featuredImage && doc.featuredImage.asset ? (doc.featuredImage as SanityImage) : null;
  const cardFallback = images[0] ?? null;
  const before =
    doc.beforeImage && doc.beforeImage.asset ? (doc.beforeImage as SanityImage) : null;
  return {
    ...doc,
    images,
    featuredImage: featured ?? cardFallback,
    beforeImage: before,
    beforeAfterAligned: Boolean(doc.beforeAfterAligned),
    galleryCategories: normalizeResolvedCategories(
      doc.galleryCategories as Array<{
        _id?: string;
        title?: string;
        slug: string | null;
      }> | null,
    ),
  };
}

export async function getAllProjectSlugs(): Promise<string[]> {
  if (!sanityConfigured) {
    return [];
  }
  const slugs = await sanityClient.fetch<string[]>(
    allProjectSlugsQuery,
    {},
    sanityFetchOptions(),
  );
  return slugs.filter((s) => typeof s === "string" && s.length > 0);
}

export type ProjectSitemapEntry = {
  slug: string;
  _updatedAt?: string;
};

export async function getProjectSitemapEntries(): Promise<ProjectSitemapEntry[]> {
  if (!sanityConfigured) {
    return [];
  }
  const rows = await sanityClient.fetch<ProjectSitemapEntry[]>(
    projectSitemapEntriesQuery,
    {},
    sanityFetchOptions(),
  );
  return rows.filter((r) => typeof r.slug === "string" && r.slug.length > 0);
}
