import { Product } from "@/types";
import { formatPrice } from "@/utils/format";
import TransitionLink from "./transition-link";
import { useState } from "react";
import { Button } from "zmp-ui";
import { useAddToCart } from "@/hooks";
import QuantityInput from "./quantity-input";

export interface ProductItemProps {
  product: Product;
  /**
   * Whether to replace the current page when user clicks on this product item. Default behavior is to push a new page to the history stack.
   * This prop should be used when navigating to a new product detail from a current product detail page (related products, etc.)
   */
  replace?: boolean;
}

export default function ProductItem(props: ProductItemProps) {
  const [selected, setSelected] = useState(false);
  const { addToCart, cartQuantity } = useAddToCart(props.product);

  return (
    <div
      className="flex flex-col cursor-pointer group card hover:shadow-lg transition-all duration-300 w-full"
      onClick={() => setSelected(true)}
    >
      <TransitionLink
        to={`/product/${props.product.id}`}
        replace={props.replace}
        className="p-3 pb-0"
      >
        {({ isTransitioning }) => (
          <>
            <div className="relative overflow-hidden rounded-xl mb-3">
              <img
                src={props.product.image}
                className="w-full h-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                style={{
                  viewTransitionName:
                    isTransitioning && selected
                      ? `product-image-${props.product.id}`
                      : undefined,
                }}
                alt={props.product.name}
              />
              {props.product.originalPrice && (
                <div className="absolute top-2 right-2 bg-danger text-white text-xs px-2 py-1 rounded-full font-semibold">
                  -
                  {100 -
                    Math.round(
                      (props.product.price * 100) / props.product.originalPrice
                    )}
                  %
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="min-h-[2.5rem]">
                <div className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
                  {props.product.name}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-bold text-primary">
                  {formatPrice(props.product.price)}
                </div>
                {props.product.originalPrice && (
                  <span className="text-sm text-subtitle line-through">
                    {formatPrice(props.product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </TransitionLink>
      <div className="p-3 pt-2">
        {cartQuantity === 0 ? (
          <Button
            variant="secondary"
            size="small"
            fullWidth
            className="rounded-lg font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(1, {
                toast: true,
              });
            }}
          >
            Thêm vào giỏ
          </Button>
        ) : (
          <QuantityInput value={cartQuantity} onChange={addToCart} />
        )}
      </div>
    </div>
  );
}
