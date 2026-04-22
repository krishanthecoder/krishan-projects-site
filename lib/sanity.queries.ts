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
  projectTitle: string;
  projectLocation?: string;
  projectValue?: number;
  services: string[];
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
    }
  }
}`;

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

  const projects = await sanityClient.fetch<
    Array<{
      _id: string;
      title: string;
      projectLocation?: string;
      projectValue?: number;
      services?: string[];
      images: SanityImage[] | null;
    }>
  >(latestProjectsWithImagesQuery);

  return projects.flatMap((project) =>
    (project.images ?? [])
      .filter((image) => Boolean(image?.asset))
      .map((image, index) => ({
        _id: `${project._id}-${index}`,
        projectTitle: project.title,
        projectLocation: project.projectLocation,
        projectValue: project.projectValue,
        services: project.services ?? [],
        image,
      })),
  ) as GalleryImageItem[];
}
