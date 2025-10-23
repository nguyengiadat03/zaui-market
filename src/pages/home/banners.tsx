import Carousel from "@/components/carousel";
import { useAtomValue } from "jotai";
import { bannersState } from "@/state";

export default function Banners() {
  const banners = useAtomValue(bannersState);

  return (
    <div className="px-4 py-2">
      <Carousel
        slides={banners.map((banner) => (
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              src={banner}
              alt="Banner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ))}
      />
    </div>
  );
}
