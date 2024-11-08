import { useTranslation } from 'next-i18next';
import { billingAddressAtom, couponAtom, discountAtom, shippingAddressAtom, verifiedResponseAtom } from '@store/checkout';
import dynamic from 'next/dynamic';
import { getLayout } from '@components/layouts/layout';
import useUser from '@framework/auth/use-user';
import { AddressType } from '@framework/utils/constants';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { atom, useAtom } from 'jotai';
import usePrice from '../lib/use-price';
import { calculatePaidTotal, calculateTotal } from '../store/quick-cart/cart.utils';
import { useCart } from '../store/quick-cart/cart.context';
export { getStaticProps } from '@framework/ssr/common';

const ScheduleGrid = dynamic(
  () => import('@components/checkout/schedule/schedule-grid')
);
const AddressGrid = dynamic(() => import('@components/checkout/address-grid'));
const ContactGrid = dynamic(
  () => import('@components/checkout/contact/contact-grid')
);
const RightSideView = dynamic(
  () => import('@components/checkout/right-side-view')
);

export const orderIdAtom = atom('')
export const amountAtom = atom(0)
export const currencyAtom = atom('')

export default function CheckoutPage() {
  const { me } = useUser();
  const { t } = useTranslation();
  const [orderID, setOrderID] = useAtom(orderIdAtom)
  const [amount, setAmount] = useAtom(amountAtom)
  const [currency, setCurrency] = useAtom(currencyAtom)
  const { items, isEmpty: isEmptyCart } = useCart();
  const [verifiedResponse] = useAtom(verifiedResponseAtom);
  const [coupon, setCoupon] = useAtom(couponAtom);
  const [discount] = useAtom(discountAtom);

  const available_items = items?.filter(
    (item) => !verifiedResponse?.unavailable_products?.includes(item.id)
  );

  const { price: tax } = usePrice(
    verifiedResponse && {
      amount: verifiedResponse.total_tax ?? 0,
    }
  );

  const { price: shipping } = usePrice(
    verifiedResponse && {
      amount: verifiedResponse.shipping_charge ?? 0,
    }
  );

  const base_amount = calculateTotal(available_items);
  const { price: sub_total } = usePrice(
    verifiedResponse && {
      amount: base_amount,
    }
  );

  const { price: discountPrice } = usePrice(
    //@ts-ignore
    discount && {
      amount: Number(discount),
    }
  );

  const { price: total } = usePrice(
    verifiedResponse && {
      amount: calculatePaidTotal(
        {
          totalAmount: base_amount,
          tax: verifiedResponse?.total_tax,
          shipping_charge: verifiedResponse?.shipping_charge,
        },
        Number(discount)
      ),
    }
  );

  return (
    <div className="py-8 px-4 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20 bg-gray-100">
      <div className="flex flex-col lg:flex-row items-center lg:items-start m-auto lg:space-s-8 w-full max-w-5xl">
        <div className="lg:max-w-2xl w-full space-y-6">
          <ContactGrid
            className="shadow-700 bg-light p-5 md:p-8"
            //@ts-ignore
            contact={me?.profile?.contact}
            label={t('text-contact-number')}
            count={1}
          />

          <AddressGrid
            userId={me?.id!}
            className="shadow-700 bg-light p-5 md:p-8"
            label={t('text-billing-address')}
            count={2}
            //@ts-ignore
            addresses={me?.address?.filter(
              (address: any) => address?.type === AddressType.Billing
            )}
            atom={billingAddressAtom}
            type={AddressType.Billing}
          />
          <AddressGrid
            userId={me?.id!}
            className="shadow-700 bg-light p-5 md:p-8"
            label={t('text-shipping-address')}
            count={3}
            //@ts-ignore
            addresses={me?.address?.filter(
              (address: any) => address?.type === AddressType.Shipping
            )}
            atom={shippingAddressAtom}
            type={AddressType.Shipping}
          />
          <ScheduleGrid
            className="shadow-700 bg-light p-5 md:p-8"
            label={t('text-delivery-schedule')}
            count={4}
          />
        </div>
        <div className="w-full lg:w-96 mb-10 sm:mb-12 lg:mb-0 mt-10">
          <RightSideView/>
        </div>
      </div>
    </div>
  );
}
CheckoutPage.authenticate = true;
CheckoutPage.getLayout = getLayout;
