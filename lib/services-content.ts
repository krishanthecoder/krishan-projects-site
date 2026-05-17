import type { LucideIcon } from "lucide-react";
import {
  BrickWall,
  Cable,
  Droplets,
  Grid2x2,
  Hammer,
  Layers,
  Paintbrush,
  SquareStack,
  Waves,
} from "lucide-react";

export type ServiceOffering = {
  id: string;
  title: string;
  shortLabel: string;
  icon: LucideIcon;
  summary: string;
  description: string;
  includes: string[];
};

export const serviceOfferings: ServiceOffering[] = [
  {
    id: "brickwork-and-blockwork",
    title: "Brickwork and Blockwork",
    shortLabel: "Brickwork",
    icon: BrickWall,
    summary:
      "Structural and cosmetic masonry — extensions, walls, openings, and careful matching to existing brick.",
    description:
      "From garden walls to structural openings for new doors and windows, we build line-and-level work that ties in with what is already on site. Where matching brick is tricky, we talk it through before we start so the repair does not shout.",
    includes: [
      "Single and two-storey extension shells",
      "Garden and boundary walls",
      "Door and window openings with lintels",
      "Repointing and local brick repairs",
      "Blockwork for garages, stores, and internal partitions",
    ],
  },
  {
    id: "carpentry",
    title: "Carpentry",
    shortLabel: "Carpentry",
    icon: Hammer,
    summary:
      "First and second-fix joinery — studwork, doors, skirting, and kitchen carcasses fitted square and secure.",
    description:
      "Carpentry ties the structure to the finish. We set out stud walls, hang doors that close cleanly, and fit joinery with consistent gaps and fixings in the right places — so decorators and worktops are not fighting out-of-square frames.",
    includes: [
      "Stud walls, noggins, and ceiling straps",
      "Door lining, hanging, and architrave",
      "Skirting, window boards, and shelving",
      "Kitchen carcass installation and adjustments",
      "Decking, fencing, and outdoor timber structures",
    ],
  },
  {
    id: "concrete",
    title: "Concrete",
    shortLabel: "Concrete",
    icon: SquareStack,
    summary:
      "Foundations, slabs, and bases poured level — the solid start your build needs.",
    description:
      "Concrete work is about preparation: compacted sub-base, correct reinforcement, and control joints where they are needed. We pour for footings, ground floors, and hardstanding that will take the next stage of the build without drama.",
    includes: [
      "Strip and pad foundations",
      "Ground-bearing slabs and oversites",
      "Garage and garden room bases",
      "Path, step, and hardstanding pours",
      "Breaking out and replacing failed concrete",
    ],
  },
  {
    id: "drainage",
    title: "Drainage",
    shortLabel: "Drainage",
    icon: Waves,
    summary:
      "Surface water and waste routes that protect your property — gullies, runs, and repairs.",
    description:
      "Poor drainage shows up in the wrong place — damp patches, standing water, or smells. We trace the issue, propose a practical fix, and install falls and connections that move water away from the building as intended.",
    includes: [
      "Gully and hopper clearance or replacement",
      "New downpipe and surface water runs",
      "Soakaways and French drain installations",
      "Channel drains for drives and patios",
      "Repairs to existing clay or plastic runs",
    ],
  },
  {
    id: "electrical",
    title: "Electrical",
    shortLabel: "Electrical",
    icon: Cable,
    summary:
      "Safer, tidier electrics for renovations — planned with qualified electricians where certification applies.",
    description:
      "Electrical work on renovations needs clear routing, adequate circuits, and paperwork when the job is notifiable. We work with qualified electricians for design, testing, and certification, and handle the making-good around the install.",
    includes: [
      "Additional sockets, switches, and lighting points",
      "Consumer unit upgrades via certified electricians",
      "Kitchen and bathroom electrical layouts",
      "External lighting and power for gardens or offices",
      "Testing, certification, and handover documentation",
    ],
  },
  {
    id: "painting-and-decorating",
    title: "Painting and Decorating",
    shortLabel: "Painting",
    icon: Paintbrush,
    summary:
      "Sharp, lasting finishes inside and out — with proper prep, protection, and a tidy handover.",
    description:
      "Decoration is where a project starts to feel finished. We take surfaces back to a sound base, protect what should not be painted, and apply coats that look even in natural light — not just under a torch on the last day.",
    includes: [
      "Interior walls, ceilings, and woodwork",
      "Exterior masonry and render touch-ups",
      "Wallpaper hanging and feature walls",
      "Filling, sanding, and stain blocking where needed",
      "Colour advice and sample patches before we commit",
    ],
  },
  {
    id: "plastering",
    title: "Plastering",
    shortLabel: "Plastering",
    icon: Layers,
    summary:
      "Flat, true walls and ceilings ready for paint — skims, patches, and repairs done properly.",
    description:
      "Good plastering hides the rough work underneath. Whether you need a full re-skim after a strip-out or local repairs before decorating, we focus on flat planes, clean corners, and drying times that will not rush your schedule.",
    includes: [
      "Full room and ceiling re-skimming",
      "Patch repairs after chasing or removals",
      "Bonding and dubbing out uneven substrates",
      "External render repairs and local make-good",
      "Preparation for coving and architrave finishes",
    ],
  },
  {
    id: "plumbing",
    title: "Plumbing",
    shortLabel: "Plumbing",
    icon: Droplets,
    summary:
      "Reliable water and heating alterations for kitchens, bathrooms, and day-to-day fixes.",
    description:
      "We plan pipe runs so they are accessible for maintenance, test before we board over, and leave you with clear isolation points. For larger heating or gas work, we coordinate with certified specialists where certification is required.",
    includes: [
      "Kitchen and bathroom first and second fix",
      "Radiator moves, swaps, and valve upgrades",
      "Leaks, traps, and sanitaryware replacements",
      "Outside taps and appliance connections",
      "Coordination with certified gas engineers when needed",
    ],
  },
  {
    id: "tiling",
    title: "Tiling",
    shortLabel: "Tiling",
    icon: Grid2x2,
    summary:
      "Straight, watertight tile work for bathrooms, kitchens, and floors — with falls and trims done properly.",
    description:
      "Tiling shows every mistake in the substrate. We check levels and waterproofing before the first tile goes down, plan cuts so the eye lands in the right place, and leave consistent grout lines and silicone details that will not fail in the first year.",
    includes: [
      "Bathroom and wet-room wall and floor tiling",
      "Kitchen splashbacks and feature walls",
      "Porcelain, ceramic, and natural stone",
      "Waterproof tanking and wet-area preparation",
      "Underfloor heating prep and tile overlays",
    ],
  },
];
