import { CartIcon, CategoryIcon, HomeIcon, PackageIcon } from "./vectors";
import HorizontalDivider from "./horizontal-divider";
import { useAtomValue } from "jotai";
import { cartState } from "@/state";
import TransitionLink from "./transition-link";
import { useRouteHandle } from "@/hooks";
import Badge from "./badge";

const NAV_ITEMS = [
  {
    name: "Trang chủ",
    path: "/",
    icon: HomeIcon,
  },
  {
    name: "Đơn hàng",
    path: "/orders",
    icon: PackageIcon,
  },
  {
    name: "Giỏ hàng",
    path: "/cart",
    icon: (props) => {
      const cart = useAtomValue(cartState);

      return (
        <Badge value={cart.length}>
          <CartIcon {...props} />
        </Badge>
      );
    },
  },
  {
    name: "Danh mục",
    path: "/categories",
    icon: CategoryIcon,
  },
];

export default function Footer() {
  const [handle] = useRouteHandle();

  if (!handle?.noFooter) {
    return (
      <>
        <HorizontalDivider />
        <div className="w-full bg-section border-t border-border">
          <div
            className="w-full px-4 pt-2 grid pb-2"
            style={{
              gridTemplateColumns: `repeat(${NAV_ITEMS.length}, 1fr)`,
            }}
          >
            {NAV_ITEMS.map((item) => {
              return (
                <TransitionLink
                  to={item.path}
                  key={item.path}
                  className="flex flex-col items-center space-y-1 p-2 cursor-pointer rounded-xl transition-all duration-200 hover:bg-primary/5 active:scale-95"
                >
                  {({ isActive }) => (
                    <>
                      <div className="w-6 h-6 flex justify-center items-center">
                        <item.icon active={isActive} />
                      </div>
                      <div
                        className={`text-xs font-medium transition-colors ${
                          isActive ? "text-primary" : "text-subtitle"
                        }`}
                      >
                        {item.name}
                      </div>
                    </>
                  )}
                </TransitionLink>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}
