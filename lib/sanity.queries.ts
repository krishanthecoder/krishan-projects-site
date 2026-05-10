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

export type Project = {
  _id: string;
  title: string;
  images: SanityImage[];
  description: PortableTextBlock[];
  projectLocation?: string;
  projectValue?: number;
  services: string[];
};

export type GalleryProject = {
  _id: string;
  title: string;
  projectLocation?: string;
  projectValue?: number;
  services: string[];
  image: SanityImage | null;
};

export type GalleryImageItem = {
  _id: string;
  /** Sanity project document id (multiple gallery rows can share one project). */
  projectId: string;
  projectTitle: string;
  projectLocation?: string;
  projectValue?: number;
  services: string[];
  /** Categories tagged on this image in Studio (gallery filter). */
  galleryCategories: GalleryCategory[];
  image: SanityImage;
};

export type GalleryCategory = {
  _id: string;
  title: string;
  slug: string;
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
  images,
  description,
  projectLocation,
  projectValue,
  services
}`;

const allTestimonialsQuery = groq`*[_type == "testimonial"] | order(_createdAt desc){
  _id,
  clientName,
  jobTitle,
  rating,
  "createdAt": _createdAt,
  content
}`;

const latestProjectsForGalleryQuery = groq`*[_type == "project"] | order(_createdAt desc)[0...6]{
  _id,
  title,
  projectLocation,
  projectValue,
  services,
  "image": images[0]{
    ...,
    asset->{
      _id,
      metadata{
        lqip
      }
    }
  }
}`;

const latestProjectsWithImagesQuery = groq`*[_type == "project"] | order(_createdAt desc)[0...6]{
  _id,
  title,
  projectLocation,
  projectValue,
  services,
  "images": images[]{
    ...,
    asset->{
      _id,
      metadata{
        lqip
      }
    },
    galleryCategories[]->{
      _id,
      title,
      "slug": slug.current
    }
  }
}`;

const galleryCategoriesQuery = groq`*[_type == "galleryCategory" && defined(slug.current)] | order(sortOrder asc, title asc) {
  _id,
  title,
  "slug": slug.current
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
  title: string;
  projectLocation?: string;
  projectValue?: number;
  services?: string[];
  images: GalleryImageFromGroq[] | null;
};

function galleryImagesFromProjects(projects: ProjectRowForGallery[]): GalleryImageItem[] {
  return projects.flatMap((project) =>
    (project.images ?? [])
      .filter((img) => Boolean(img?.asset))
      .map((img, index) => {
        const { galleryCategories, ...rest } = img;
        const normalized =
          galleryCategories?.filter(
            (c): c is GalleryCategory =>
              Boolean(c?._id && typeof c.slug === "string" && c.slug.length > 0 && c.title),
          ) ?? [];

        return {
          _id: `${project._id}-${index}`,
          projectId: project._id,
          projectTitle: project.title,
          projectLocation: project.projectLocation,
          projectValue: project.projectValue,
          services: project.services ?? [],
          galleryCategories: normalized,
          image: rest as SanityImage,
        };
      }),
  );
}

async function fetchLatestGalleryProjects(): Promise<ProjectRowForGallery[]> {
  return sanityClient.fetch<ProjectRowForGallery[]>(latestProjectsWithImagesQuery);
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

  const projects = await fetchLatestGalleryProjects();
  return galleryImagesFromProjects(projects);
}

export async function getGalleryFilterData(): Promise<{
  categories: GalleryCategory[];
  images: GalleryImageItem[];
}> {
  if (!sanityConfigured) {
    return { categories: [], images: [] };
  }

  const [rawCategories, projects] = await Promise.all([
    sanityClient.fetch<Array<{ _id: string; title: string; slug: string | null }>>(galleryCategoriesQuery),
    fetchLatestGalleryProjects(),
  ]);

  const categories: GalleryCategory[] = rawCategories
    .filter((c): c is GalleryCategory => typeof c.slug === "string" && c.slug.length > 0 && Boolean(c.title));

  return {
    categories,
    images: galleryImagesFromProjects(projects),
  };
}
