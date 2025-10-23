import TransitionLink from "@/components/transition-link";
import { useAtomValue } from "jotai";
import { categoriesState } from "@/state";

export default function Category() {
  const categories = useAtomValue(categoriesState);

  return (
    <div className="bg-section px-4 py-4">
      <h2 className="text-lg font-semibold text-foreground mb-4 fade-in-up">
        Danh mục sản phẩm
      </h2>
      <div
        className="grid gap-4 overflow-x-auto pb-2 stagger-children"
        style={{
          gridTemplateColumns: `repeat(${categories.length}, minmax(80px, 1fr))`,
          gridAutoRows: "minmax(80px, auto)",
        }}
      >
        {categories.map((category) => (
          <TransitionLink
            key={category.id}
            className="flex flex-col items-center space-y-2 flex-none cursor-pointer group hover-lift"
            to={`/category/${category.id}`}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
              <img
                src={category.image}
                className="w-10 h-10 object-cover rounded-xl"
                alt={category.name}
              />
            </div>
            <div className="text-center text-xs font-medium w-full line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {category.name}
            </div>
          </TransitionLink>
        ))}
      </div>
    </div>
  );
}
