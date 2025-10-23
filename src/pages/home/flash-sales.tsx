import ProductGrid from "@/components/product-grid";
import Section from "@/components/section";
import { useAtomValue } from "jotai";
import { flashSaleProductsState } from "@/state";

export default function FlashSales() {
  const products = useAtomValue(flashSaleProductsState);

  return (
    <Section
      title="Giá tốt hôm nay"
      className="bg-gradient-to-r from-orange-50 to-red-50 fade-in-up"
    >
      <ProductGrid products={products} />
    </Section>
  );
}
