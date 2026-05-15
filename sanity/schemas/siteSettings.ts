import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Homepage Settings",
  type: "document",
  preview: {
    select: {
      featuredTitle: "homepageFeaturedProject.title",
      manual: "chooseHomepageProjectManually",
    },
    prepare(selection: Record<string, unknown>) {
      const manual = Boolean(selection.manual);
      const featuredTitle =
        typeof selection.featuredTitle === "string" ? selection.featuredTitle : undefined;
      return {
        title: "Homepage Settings",
        subtitle: manual
          ? featuredTitle
            ? `Featured: ${featuredTitle}`
            : "Turned on — pick a published project below"
          : "Automatic — homepage uses your latest project",
      };
    },
  },
  fields: [
    defineField({
      name: "chooseHomepageProjectManually",
      title: "Choose a specific project for the homepage",
      type: "boolean",
      options: {
        layout: "switch",
      },
      description:
        "Turn this on when you want to pick exactly which published job appears in “From a recent job” on the homepage (and the matching hero imagery). Turn it off to go back to always showing the project you added most recently.",
      initialValue: false,
    }),
    defineField({
      name: "homepageFeaturedProject",
      title: "Homepage featured project",
      type: "reference",
      to: [{ type: "project" }],
      options: {
        disableNew: true,
      },
      hidden: ({ document }) => !document?.chooseHomepageProjectManually,
      description:
        "Only used when the switch above is on. Pick a published project that has a featured image or gallery photos. Publish this document after changing it. There should only be one “Homepage Settings” document with id **siteSettings** — delete any extra copies in Vision if you see duplicates.",
    }),
    defineField({
      name: "heroSectionImage",
      title: "Hero Section Image",
      type: "image",
      options: { hotspot: true },
      description:
        "Wide background image behind the homepage hero (top of the site). Recommended: 1920 × 1080 px, max 500 KB, JPEG. Leave empty for the default warm stone background.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Short description for accessibility (e.g. team on a renovation site).",
        }),
      ],
    }),
    defineField({
      name: "heroSectionImageMobile",
      title: "Hero Section Image (mobile, optional)",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional image tuned for phones. Recommended: 1080 × 1350 px, max 350 KB, JPEG. Uses the main hero image above when empty.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
  ],
});
