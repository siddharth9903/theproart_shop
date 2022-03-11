import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import {
  useCreateOrderMutation,
  useOrderStatusesQuery,
} from '@framework/orders/orders.query';
import { ROUTES } from '@lib/routes';
import Razorpay from 'razorpay';
import ValidationError from '@components/ui/validation-error';
import Button from '@components/ui/button';
import isEmpty from 'lodash/isEmpty';
import { formatOrderedProduct } from '@lib/format-ordered-product';
import { useCart } from '@store/quick-cart/cart.context';
import { useAtom } from 'jotai';
import { checkoutAtom, discountAtom } from '@store/checkout';
import {
  calculatePaidTotal,
  calculateTotal,
} from '@store/quick-cart/cart.utils';
import axios from 'axios';
import { amountAtom, currencyAtom, orderIdAtom } from '../../../pages/checkout';

export const PlaceOrderAction: React.FC = (props) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: createOrder, isLoading: loading } = useCreateOrderMutation();
  const { data: orderStatusData } = useOrderStatusesQuery();

  const { items } = useCart();
  const [
    {
      billing_address,
      shipping_address,
      delivery_time,
      coupon,
      verified_response,
      customer_contact,
      payment_gateway,
      token,
    },
  ] = useAtom(checkoutAtom);
  const [discount] = useAtom(discountAtom);

  const [orderId, setOrderID] = useAtom(orderIdAtom);
  const [amount, setAmount] = useAtom(amountAtom);
  const [currency, setCurrency] = useAtom(currencyAtom);

  useEffect(() => {
    setErrorMessage(null);
  }, [payment_gateway]);

  useEffect(() => {
    loadOrderId();
  }, []);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };
  async function loadOrderId() {
    let data = {
      amount: total * 100,
    };
    await axios
      .post(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/orders/create/orderId`, data)
      .then((res) => {
        const { order } = res.data;
        if (order) {
          setOrderID(order.id);
          setCurrency(order.currency);
          setAmount(order.amount);
        }
      });
  }

  const makePayment = async () => {
    const res = await initializeRazorpay();
    return new Promise((resolve, reject) => {
      if (!res) {
        alert('Razorpay SDK Failed to load');
        reject('razorpay failed');
      }

      var options = {
        key: process.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
        name: 'prod',
        currency: 'INR',
        amount: amount,
        order_id: orderId,
        description: 'Thankyou for your trust.',
        image: 'https://manuarora.in/logo.png',
        handler: function (response: any) {
          // Validate payment at server - using webhooks is a better idea.
          resolve({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        // prefill: {
        //   name: "Manu Arora",
        //   email: "manuarorawork@gmail.com",
        //   contact: "9999999999",
        // },
      };
      // const paymentObject = new window.Razorpay(options);
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    });
  };

  const available_items = items?.filter(
    (item) => !verified_response?.unavailable_products?.includes(item.id)
  );

  const subtotal = calculateTotal(available_items);
  const total = calculatePaidTotal(
    {
      totalAmount: subtotal,
      tax: verified_response?.total_tax!,
      shipping_charge: verified_response?.shipping_charge!,
    },
    Number(discount)
  );
  const handlePlaceOrder = async () => {
    if (!customer_contact) {
      setErrorMessage('Contact Number Is Required');
      return;
    }
    if (!payment_gateway) {
      setErrorMessage('Gateway Is Required');
      return;
    }
    // if (payment_gateway === 'RAZORPAY' && !token) {
    //   setErrorMessage('Please Pay First');
    //   return;
    // }
    let input = {
      //@ts-ignore
      products: available_items?.map((item) => formatOrderedProduct(item)),
      status: orderStatusData?.orderStatuses?.data[0]?.id ?? '1',
      amount: subtotal,
      coupon_id: Number(coupon?.id),
      discount: discount ?? 0,
      paid_total: total,
      sales_tax: verified_response?.total_tax,
      delivery_fee: verified_response?.shipping_charge,
      total,
      delivery_time: delivery_time?.title,
      customer_contact,
      payment_gateway,
      billing_address: {
        ...(billing_address?.address && billing_address.address),
      },
      shipping_address: {
        ...(shipping_address?.address && shipping_address.address),
      },
      paymentInfo: {},
    };
    if (payment_gateway === 'RAZORPAY') {
      //@ts-ignore
      input.token = token;
    }
    if (payment_gateway === 'RAZORPAY') {
      const paymentData: any = await makePayment();
      const paymentStatus = await axios.post(
        `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/orders/payment/verify`,
        paymentData
      );
      let isPaymentSuccess = paymentStatus.data.signatureIsValid;
      if (isPaymentSuccess) {
        delete input.billing_address.__typename;
        delete input.shipping_address.__typename;
        input.paymentInfo = {
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_order_id: paymentData.razorpay_order_id,
        };
        createOrder(input, {
          onSuccess: (order: any) => {
            if (order?.tracking_number) {
              router.push(`${ROUTES.ORDERS}/${order?.tracking_number}`);
            }
          },
          onError: (error: any) => {
            toast.error(`Error occured`);
            setErrorMessage(error?.response?.data?.message);
          },
        });
      } else {
        toast.error(`Payment Failed !!`);
      }
    } else {
      createOrder(input, {
        onSuccess: (order: any) => {
          if (order?.tracking_number) {
            router.push(`${ROUTES.ORDERS}/${order?.tracking_number}`);
          }
        },
        onError: (error: any) => {
          toast.error(`Error occured`);
          setErrorMessage(error?.response?.data?.message);
        },
      });
    }
  };
  const isAllRequiredFieldSelected = [
    customer_contact,
    payment_gateway,
    billing_address,
    shipping_address,
    delivery_time,
    available_items,
  ].every((item) => !isEmpty(item));
  return (
    <>
      <Button
        loading={loading}
        className="w-full mt-5"
        onClick={handlePlaceOrder}
        disabled={!isAllRequiredFieldSelected}
        {...props}
      />
      {errorMessage && (
        <div className="mt-3">
          <ValidationError message={errorMessage} />
        </div>
      )}
    </>
  );
};
