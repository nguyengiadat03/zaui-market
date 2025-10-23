import HorizontalDivider from "@/components/horizontal-divider";
import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { productState } from "@/state";
import { formatPrice } from "@/utils/format";
import ShareButton from "./share-buttont";
import RelatedProducts from "./related-products";
import { useAddToCart } from "@/hooks";
import { Button } from "zmp-ui";
import Section from "@/components/section";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = useAtomValue(productState(Number(id)))!;

  const navigate = useNavigate();
  const { addToCart } = useAddToCart(product);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full p-4 pb-2 space-y-4 bg-section fade-in-up">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img
              key={product.id}
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              style={{
                viewTransitionName: `product-image-${product.id}`,
              }}
            />
            {product.originalPrice && (
              <div className="absolute top-3 right-3 bg-danger text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                -
                {100 -
                  Math.round((product.price * 100) / product.originalPrice)}
                %
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>
            <div className="text-lg font-medium text-foreground">
              {product.name}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-subtitle line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
          <ShareButton product={product} />
        </div>
        {product.detail && (
          <>
            <div className="bg-background h-2 w-full"></div>
            <Section title="Mô tả sản phẩm" className="fade-in-up">
              <div className="text-sm whitespace-pre-wrap text-subtitle p-4 pt-2 leading-relaxed">
                {product.detail}
              </div>
            </Section>
          </>
        )}
        <div className="bg-background h-2 w-full"></div>
        <Section title="Sản phẩm khác" className="fade-in-up">
          <RelatedProducts currentProductId={product.id} />
        </Section>
      </div>

      <HorizontalDivider />
      <div className="flex-none grid grid-cols-2 gap-3 py-4 px-4 bg-section">
        <Button
          variant="tertiary"
          className="rounded-xl font-semibold hover-lift"
          onClick={() => {
            addToCart(1, {
              toast: true,
            });
          }}
        >
          Thêm vào giỏ
        </Button>
        <Button
          className="rounded-xl font-semibold hover-lift"
          onClick={() => {
            addToCart(1);
            navigate("/cart", {
              viewTransition: true,
            });
          }}
        >
          Mua ngay
        </Button>
      </div>
    </div>
  );
}
