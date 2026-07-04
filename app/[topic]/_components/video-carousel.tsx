"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import { IVideoCarouselSlide } from "../_utils/content-segments";

const PHOTOS_BASE_URL = "https://photos.charliemeyer.xyz";

const videoSrc = (mediaKey: string) =>
  `/api/photos/preview?key=${encodeURIComponent(mediaKey)}`;
const posterSrc = (mediaKey: string) =>
  `${PHOTOS_BASE_URL}/api/files/image?key=${encodeURIComponent(mediaKey)}&w=preview`;

interface IVideoCarouselProps {
  slides: IVideoCarouselSlide[];
  loop?: boolean;
}

export function VideoCarousel({ slides, loop = false }: IVideoCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const selected = api.selectedScrollSnap();
      setCurrent(selected);
      videoRefs.current.forEach((video, index) => {
        if (video && index !== selected) video.pause();
      });
    };

    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handlePlay = (index: number) => {
    setPlayingIndex(index);
    videoRefs.current.forEach((video, i) => {
      if (video && i !== index) video.pause();
    });
  };

  const handlePause = (index: number) => {
    setPlayingIndex((playing) => (playing === index ? null : playing));
  };

  const togglePlayback = (index: number) => {
    if (index !== current) {
      api?.scrollTo(index);
      return;
    }
    const video = videoRefs.current[index];
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const activeTitle = slides[current]?.title;

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "center", loop, containScroll: false }}
      aria-label="video gallery"
      className="my-8"
    >
      <CarouselContent>
        {slides.map((slide, index) => {
          const isActive = index === current;
          const isPlaying = playingIndex === index;
          const label = slide.title ?? `video ${index + 1}`;

          return (
            <CarouselItem
              key={slide.mediaKey}
              aria-label={`${index + 1} of ${slides.length}`}
              className="basis-auto"
            >
              <figure
                className={cn(
                  "border-border group relative h-[360px] max-w-[80vw] overflow-hidden rounded-xl border bg-black transition-opacity duration-300 sm:h-[420px]",
                  !isActive && "opacity-50",
                )}
                style={{ aspectRatio: slide.aspect ?? "16/9" }}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={videoSrc(slide.mediaKey)}
                  poster={posterSrc(slide.mediaKey)}
                  preload="none"
                  loop
                  playsInline
                  onPlay={() => handlePlay(index)}
                  onPause={() => handlePause(index)}
                  className="size-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => togglePlayback(index)}
                  aria-label={
                    !isActive
                      ? `Go to ${label}`
                      : isPlaying
                        ? `Pause ${label}`
                        : `Play ${label}`
                  }
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity",
                    isPlaying &&
                      "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                  )}
                >
                  {isActive && (
                    <span className="flex size-12 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
                      {isPlaying ? (
                        <Pause className="size-5" fill="currentColor" />
                      ) : (
                        <Play className="ml-0.5 size-5" fill="currentColor" />
                      )}
                    </span>
                  )}
                </button>
              </figure>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <div className="mt-3 flex items-center gap-2">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
        {activeTitle && (
          <span className="text-muted-foreground min-w-0 flex-1 truncate pl-1 text-sm">
            {activeTitle}
          </span>
        )}
        <div className="flex items-center">
          {slides.map((slide, index) => (
            <button
              key={slide.mediaKey}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1} of ${slides.length}${slide.title ? `: ${slide.title}` : ""}`}
              aria-current={index === current || undefined}
              className="group/dot rounded-full p-1.5"
            >
              <span
                className={cn(
                  "block size-2 rounded-full transition-colors",
                  index === current
                    ? "bg-foreground"
                    : "bg-border group-hover/dot:bg-muted-foreground/60",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <span aria-live="polite" className="sr-only">
        {`Slide ${current + 1} of ${slides.length}${activeTitle ? `: ${activeTitle}` : ""}`}
      </span>
    </Carousel>
  );
}
