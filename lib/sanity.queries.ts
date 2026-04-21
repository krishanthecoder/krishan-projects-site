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
  services: string[];
};

export type GalleryProject = {
  _id: string;
  title: string;
  image: SanityImage | null;
};

export type Testimonial = {
  _id: string;
  clientName: string;
  rating: number;
  content: string;
};

const allProjectsQuery = groq`*[_type == "project"] | order(_createdAt desc){
  _id,
  title,
  images,
  description,
  services
}`;

const allTestimonialsQuery = groq`*[_type == "testimonial"] | order(_createdAt desc){
  _id,
  clientName,
  rating,
  content
}`;

const latestProjectsForGalleryQuery = groq`*[_type == "project"] | order(_createdAt desc)[0...6]{
  _id,
  title,
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
