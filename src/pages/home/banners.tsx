import Carousel from "@/components/carousel";
import { useAtomValue } from "jotai";
import { bannersState } from "@/state";
import { useState, useEffect } from "react";

export default function Banners() {
  const banners = useAtomValue(bannersState);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="px-4 py-2">
      <Carousel
        slides={banners.map((banner, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl shadow-2xl group cursor-pointer"
          >
            <img
              className="w-full h-48 object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
              src={banner}
              alt="Banner"
              style={{
                filter:
                  index === currentIndex
                    ? "brightness(1.1)"
                    : "brightness(0.9)",
                transform: index === currentIndex ? "scale(1.02)" : "scale(1)",
              }}
            />

            {/* Animated overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* Marketing call-to-action overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="bg-gradient-to-r from-primary/80 to-secondary/80 backdrop-blur-sm rounded-lg p-3 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 shadow-lg border border-white/20">
                <div className="text-sm font-bold mb-1 flex items-center gap-2">
                  <span className="animate-bounce">🔥</span>
                  Khuyến mãi đặc biệt
                  <span className="animate-pulse text-yellow-300">HOT</span>
                </div>
                <div className="text-xs opacity-90 font-medium">
                  Giảm giá lên đến 50% - Mua ngay!
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <span className="animate-ping">●</span>
                  <span>Số lượng có hạn</span>
                </div>
              </div>
            </div>

            {/* Floating elements for visual appeal */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 backdrop-blur-sm rounded-full p-2 animate-bounce shadow-lg border-2 border-white/30">
                <span className="text-white text-xs font-bold drop-shadow-lg">
                  HOT
                </span>
              </div>
            </div>

            {/* Additional marketing elements */}
            <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-300">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
                <span className="text-white text-xs font-semibold flex items-center gap-1">
                  <span className="animate-spin">⭐</span>
                  Đánh giá 5 sao
                </span>
              </div>
            </div>

            {/* Discount badge */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-600 delay-400">
              <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm shadow-xl animate-pulse border-2 border-white">
                -50%
              </div>
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Particle effects */}
            <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: "2s",
                  }}
                />
              ))}
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur-xl" />
          </div>
        ))}
      />
    </div>
  );
}
