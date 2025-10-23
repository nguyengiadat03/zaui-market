import { useCheckout } from "@/hooks";
import { useAtomValue } from "jotai";
import { cartTotalState } from "@/state";
import { formatPrice } from "@/utils/format";
import { Button, Radio } from "zmp-ui";
import { useState } from "react";

export default function Pay() {
  const { totalAmount } = useAtomValue(cartTotalState);
  const checkout = useCheckout();
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank");

  return (
    <div className="flex-none py-3 px-4 bg-section">
      <div className="space-y-3">
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
              await checkout(paymentMethod);
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
