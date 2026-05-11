import groq from "groq";

import { sanityClient, sanityConfigured } from "./sanity.client";

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
  startDate?: string;
  endDate?: string;
  projectLocation?: string;
  projectValue?: number;
  services: string[];
  description: PortableTextBlock[];
  featuredImage: SanityImage | null;
  images: SanityImage[];
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
  galleryCategories[]->{
    _id,
    title,
    "slug": slug.current
  },
  images,
  description,
  projectLocation,
  projectValue,
  services
}`;

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
  galleryCategories[]->{
    _id,
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

const galleryCategoriesQuery = groq`*[_type == "galleryCategory" && defined(slug.current)] | order(sortOrder asc, title asc) {
  _id,
  title,
  "slug": slug.current
}`;

const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  title,
  startDate,
  endDate,
  projectLocation,
  projectValue,
  services,
  description,
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

function stripImageFields(img: GalleryImageFromGroq): SanityImage {
  const { _key: _k, ...rest } = img;
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
  return sanityClient.fetch<ProjectRowForGallery[]>(galleryProjectsRowQuery);
}

export async function getAllProjects() {
  if (!sanityConfigured) {
    return [];
  }
  return sanityClient.fetch<Project[]>(allProjectsQuery);
}

export async function getAllTestimonials() {
  if (!sanityConfigured) {
    return [];
  }
  return sanityClient.fetch<Testimonial[]>(allTestimonialsQuery);
}

export async function getLatestProjectsForGallery() {
  if (!sanityConfigured) {
    return [];
  }
  return sanityClient.fetch<GalleryProject[]>(latestProjectsForGalleryQuery);
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

  const [rawCategories, projects] = await Promise.all([
    sanityClient.fetch<Array<{ _id: string; title: string; slug: string | null }>>(galleryCategoriesQuery),
    fetchGalleryProjectRows(),
  ]);

  const categories: GalleryCategory[] = rawCategories
    .filter((c): c is GalleryCategory => typeof c.slug === "string" && c.slug.length > 0 && Boolean(c.title));

  return {
    categories,
    projects: toGalleryProjectCards(projects),
  };
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  if (!sanityConfigured || !slug) {
    return null;
  }
  const doc = await sanityClient.fetch<ProjectDetail | null>(projectBySlugQuery, { slug });
  if (!doc?.slug) return null;
  const images = (doc.images ?? []).filter((img) => Boolean(img?.asset)) as SanityImage[];
  const featured =
    doc.featuredImage && doc.featuredImage.asset ? (doc.featuredImage as SanityImage) : null;
  const cardFallback = images[0] ?? null;
  return {
    ...doc,
    images,
    featuredImage: featured ?? cardFallback,
  };
}

export async function getAllProjectSlugs(): Promise<string[]> {
  if (!sanityConfigured) {
    return [];
  }
  const slugs = await sanityClient.fetch<string[]>(allProjectSlugsQuery);
  return slugs.filter((s) => typeof s === "string" && s.length > 0);
}
