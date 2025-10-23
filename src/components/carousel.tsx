// Polyfills
import ResizeObserver from "resize-observer-polyfill";
Object.assign(window, { ResizeObserver });

import { ReactNode, useCallback, useEffect, useState } from "react";
import { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

export const useDotButton = (
  emblaApi: EmblaCarouselType | undefined
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

export interface CarouselProps {
  slides: ReactNode[];
  disabled?: boolean;
}

export default function Carousel(props: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      loop: true,
      skipSnaps: false,
      dragFree: false,
    },
    [
      Autoplay({
        active: !props.disabled,
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex space-x-4 mt-4 mx-4">
        {props.slides.map((slide, i) => (
          <div
            key={i}
            className="flex-none basis-full pl-2 first:pl-0 transform transition-all duration-500 ease-out"
            style={{
              opacity: i === selectedIndex ? 1 : 0.7,
              transform: `scale(${i === selectedIndex ? 1 : 0.95})`,
            }}
          >
            {slide}
          </div>
        ))}
      </div>

      <div className="py-4 flex justify-center items-center space-x-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => onDotButtonClick(index)}
            className={`rounded-full transition-all duration-300 ease-out ${
              index === selectedIndex && !props.disabled
                ? "bg-primary scale-125 shadow-lg shadow-primary/30 w-3 h-3 animate-pulse"
                : "bg-subtitle/30 hover:bg-subtitle/50 hover:scale-110 w-2 h-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
