"use client";

import { Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ScrollReveal, ScrollRevealGroup } from "@/components/ui/scroll-reveal";
import type { ProjectVideo } from "@/lib/sanity.queries";

type ProjectVideosProps = {
  videos: ProjectVideo[];
};

export function ProjectVideos({ videos }: ProjectVideosProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const lastFocusedRef = useRef<HTMLButtonElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const selected =
    videos.find((video) => video._key === selectedKey) ?? null;

  const closeModal = useCallback(() => {
    setSelectedKey(null);
    if (lastFocusedRef.current) {
      lastFocusedRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, closeModal]);

  useEffect(() => {
    if (!selected) return;
    const video = modalVideoRef.current;
    if (!video) return;
    video.muted = false;
    void video.play().catch(() => {
      // Browser blocked autoplay — visitor can press play on the controls.
    });
  }, [selected]);

  if (videos.length === 0) {
    return null;
  }

  return (
    <>
      <ScrollRevealGroup
        stagger={0.05}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {videos.map((video) => (
          <ScrollReveal key={video._key} className="flex flex-col gap-2">
            <button
              type="button"
              onClick={(event) => {
                lastFocusedRef.current = event.currentTarget;
                setSelectedKey(video._key);
              }}
              className="group relative h-64 w-full cursor-pointer overflow-hidden rounded-2xl border border-graphite/8 bg-parchment text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              aria-label={
                video.title
                  ? `Play video: ${video.title}`
                  : "Play project video"
              }
            >
              <video
                src={video.url}
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-graphite/25 transition group-hover:bg-graphite/35"
                aria-hidden="true"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-stone-white shadow-md">
                  <Play className="h-6 w-6 fill-current" aria-hidden="true" />
                </span>
              </div>
            </button>
            {video.title ? (
              <p className="text-sm text-graphite/85">{video.title}</p>
            ) : null}
          </ScrollReveal>
        ))}
      </ScrollRevealGroup>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/92 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title ?? "Project video"}
          onClick={closeModal}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-[60] rounded-xl bg-stone-white/10 px-4 py-2 text-sm font-semibold text-stone-white ring-1 ring-stone-white/20 backdrop-blur-sm transition hover:bg-stone-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            onClick={closeModal}
            aria-label="Close video"
            autoFocus
          >
            Close
          </button>

          <div
            className="relative w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl border border-stone-white/10 bg-graphite/40 shadow-2xl">
              <video
                ref={modalVideoRef}
                controls
                playsInline
                className="aspect-video w-full bg-graphite/20"
                aria-label={selected.title ?? "Project video"}
              >
                <source
                  src={selected.url}
                  type={selected.mimeType ?? "video/mp4"}
                />
              </video>
            </div>
            {selected.title ? (
              <p className="mt-3 text-center text-sm text-stone-white/90">
                {selected.title}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
