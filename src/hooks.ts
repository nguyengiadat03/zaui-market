import { useAtom, useAtomValue, useSetAtom } from "jotai";\nimport { api } from "./utils/request"; // Import api client
import { MutableRefObject, useLayoutEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { UIMatch, useMatches, useNavigate } from "react-router-dom";
import {
  cartState,
  cartTotalState,
  ordersState,
  userInfoKeyState,
  userInfoState,
} from "@/state";
import { OrderPayload, Product, ShippingAddress } from "@/types"; // Import OrderPayload, ShippingAddress
import { getConfig } from "@/utils/template";
import { authorize, openChat } from "zmp-sdk/apis"; // Bỏ createOrder
import { useAtomCallback } from "jotai/utils";

export function useRealHeight(
  element: MutableRefObject<HTMLDivElement | null>,
  defaultValue?: number
) {
  const [height, setHeight] = useState(defaultValue ?? 0);
  useLayoutEffect(() => {
    if (element.current && typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        const [{ contentRect }] = entries;
        setHeight(contentRect.height);
      });
      ro.observe(element.current);
      return () => ro.disconnect();
    }
    return () => {};
  }, [element.current]);

  if (typeof ResizeObserver === "undefined") {
    return -1;
  }
  return height;
}

export function useRequestInformation() {
  const getStoredUserInfo = useAtomCallback(async (get) => {
    const userInfo = await get(userInfoState);
    return userInfo;
  });
  const setInfoKey = useSetAtom(userInfoKeyState);
  const refreshPermissions = () => setInfoKey((key) => key + 1);

  return async () => {
    const userInfo = await getStoredUserInfo();
    if (!userInfo) {
      await authorize({
        scopes: ["scope.userInfo", "scope.userPhonenumber"],
      }).then(refreshPermissions);
      return await getStoredUserInfo();
    }
    return userInfo;
  };
}

export function useAddToCart(product: Product) {
  const [cart, setCart] = useAtom(cartState);

  const currentCartItem = useMemo(
    () => cart.find((item) => item.product.id === product.id),
    [cart, product.id]
  );

  const addToCart = (
    quantity: number | ((oldQuantity: number) => number),
    options?: { toast: boolean }
  ) => {
    setCart((cart) => {
      const newQuantity =
        typeof quantity === "function"
          ? quantity(currentCartItem?.quantity ?? 0)
          : quantity;
      if (newQuantity <= 0) {
        cart.splice(cart.indexOf(currentCartItem!), 1);
      } else {
        if (currentCartItem) {
          currentCartItem.quantity = newQuantity;
        } else {
          cart.push({
            product,
            quantity: newQuantity,
          });
        }
      }
      return [...cart];
    });
    if (options?.toast) {
      toast.success("Đã thêm vào giỏ hàng");
    }
  };

  return { addToCart, cartQuantity: currentCartItem?.quantity ?? 0 };
}

export function useCustomerSupport() {
  return () =>
    openChat({
      type: "oa",
      id: getConfig((config) => config.template.oaIDtoOpenChat),
    });
}

export function useToBeImplemented() {
  return () =>
    toast("Chức năng dành cho các bên tích hợp phát triển...", {
      icon: "🛠️",
    });
}

export function useCheckout() {
  const { totalAmount } = useAtomValue(cartTotalState);
  const [cart, setCart] = useAtom(cartState);
  const requestInfo = useRequestInformation();
  const navigate = useNavigate();
  const refreshNewOrders = useSetAtom(ordersState("pending"));
  // Thêm các state cần thiết
  const selectedStation = useAtomValue(selectedStationState);
  const shippingAddress = useAtomValue(shippingAddressState);

  return async (paymentMethod: "COD" | "ZALOPAY") => {
    try {
      // 1. Yêu cầu thông tin người dùng (để đảm bảo có token Zalo)
      await requestInfo();

      if (!shippingAddress) {
        throw new Error("Vui lòng chọn địa chỉ nhận hàng.");
      }

      // 2. Chuẩn bị payload cho Backend
      const orderPayload: OrderPayload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          qty: item.quantity,
          price: item.product.price,
        })),
        // Sử dụng địa chỉ từ ShippingAddress
        address: \`\${shippingAddress.address}, \${shippingAddress.ward}, \${shippingAddress.district}, \${shippingAddress.city}\`,
        stationId: selectedStation?.id || 0, // Dùng stationId nếu có
        payment: paymentMethod,
      };

      // 3. Gửi đơn hàng lên Backend
      const response = await api.post("/orders", orderPayload);

      if (paymentMethod === "ZALOPAY") {
        // *** Tích hợp ZaloPay: Cần gọi API ZaloPay từ Backend và trả về URL/token ***
        // Ví dụ: const { zp_token } = await api.post("/zalopay/create-order", { orderId: response.data.orderId });
        // Sau đó dùng Zalo SDK để mở ZaloPay:
        // await createOrder({ zp_token });
        
        toast.error("Tích hợp ZaloPay chưa hoàn thành. Vui lòng chọn COD.", {
          icon: "🛠️",
          duration: 5000,
        });
        throw new Error("ZaloPay integration pending.");
      }

      // 4. Xử lý thành công (COD)
      setCart([]);
      refreshNewOrders();
      navigate("/orders", {
        viewTransition: true,
      });
      toast.success("Đặt hàng thành công (COD). Đơn hàng đang chờ xử lý!", {
        icon: "🎉",
        duration: 5000,
      });
    } catch (error) {
      console.warn("Checkout Error:", error);
      toast.error("Đặt hàng thất bại. Vui lòng thử lại.", {
        icon: "❌",
        duration: 5000,
      });
      throw error; // Re-throw to let the component handle it
    }
  };
}

export function useRouteHandle() {
  const matches = useMatches() as UIMatch<
    undefined,
    | {
        title?: string | Function;
        logo?: boolean;
        search?: boolean;
        noFooter?: boolean;
        noBack?: boolean;
        noFloatingCart?: boolean;
        scrollRestoration?: number;
      }
    | undefined
  >[];
  const lastMatch = matches[matches.length - 1];

  return [lastMatch.handle, lastMatch, matches] as const;
}
