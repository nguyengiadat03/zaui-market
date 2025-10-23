import { useCheckout } from "@/hooks";
import { useAtomValue } from "jotai";
import { cartTotalState, loadableUserInfoState } from "@/state";
import { formatPrice } from "@/utils/format";
import { Button, Radio } from "zmp-ui";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Pay() {
  const { totalAmount } = useAtomValue(cartTotalState);
  const userInfo = useAtomValue(loadableUserInfoState);
  const checkout = useCheckout();
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank");

  return (
    <div className="flex-none py-3 px-4 bg-section">
      <div className="space-y-3">
        {userInfo.state === "hasData" && userInfo.data && (
          <div className="bg-background rounded-lg p-3 flex items-center space-x-3">
            <img
              className="rounded-full h-8 w-8"
              src={userInfo.data.avatar}
              alt="Avatar"
            />
            <div className="space-y-0.5 flex-1 overflow-hidden">
              <div className="text-sm truncate">{userInfo.data.name}</div>
              <div className="text-xs text-subtitle truncate">
                {userInfo.data.phone}
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs text-subtitle">Tổng thanh toán</div>
            <div className="text-sm font-medium text-primary">
              {formatPrice(totalAmount)}
            </div>
          </div>
          <Button
            onClick={async () => {
              setPaying(true);
              try {
                await checkout(paymentMethod);
              } catch (error) {
                console.warn(error);
                // Show development message for bank payment
                if (paymentMethod === "bank") {
                  toast.error(
                    "Tính năng thanh toán ngân hàng đang được phát triển. Vui lòng thử phương thức khác."
                  );
                } else {
                  toast.error("Thanh toán thất bại. Vui lòng thử lại.");
                }
              }
              setPaying(false);
            }}
            disabled={paying}
          >
            Thanh toán
          </Button>
        </div>
        <div className="space-y-2">
          <div className="text-xs font-medium">Phương thức thanh toán</div>
          <div className="space-y-2">
            <Radio.Group
              value={paymentMethod}
              onChange={(value) => setPaymentMethod(value as string)}
            >
              <Radio value="bank">Ngân hàng</Radio>
              <Radio value="card">Thẻ tín dụng</Radio>
              <Radio value="qr">Mã QR</Radio>
            </Radio.Group>
          </div>
        </div>
      </div>
    </div>
  );
}
