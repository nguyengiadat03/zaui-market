import Banners from "./banners";
import Category from "./category";
import FlashSales from "./flash-sales";

const HomePage: React.FunctionComponent = () => {
  return (
    <div className="min-h-full space-y-4 py-4">
      <Category />
      <div className="bg-section rounded-t-3xl -mt-4 pt-6">
        <Banners />
      </div>
      <FlashSales />
    </div>
  );
};

export default HomePage;
