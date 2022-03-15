import { Table } from '@components/ui/table';
import usePrice from '@lib/use-price';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@lib/locals';
import { useMemo } from 'react';
import { Image } from '@components/ui/image';
import { productPlaceholder } from '@lib/placeholders';
import ProgressBox from '../ui/progress-box/progress-box';
import { useOrderStatusesQuery } from '../../framework/rest/orders/orders.query';
import { useProductByIdQuery, useProductQuery } from '../../framework/rest/products/products.query';

const OrderItemList = (_: any, record: any) => {

  // let name = record.name;
  if (!record) {
    return <></>;
  } else {
    const { product_id } = record;
    console.log('product_id',product_id)
    const { data, isLoading: loading } = useProductByIdQuery(product_id);
    console.log('dataaaaaaaaaaa', data);
    const { price } = usePrice({
      amount: record.unit_price,
    });
    console.log('record', record);
    let name = data?.name;
    // if (record?.pivot?.variation_option_id) {
    //   const variationTitle = record?.variation_options?.find(
    //     (vo: any) => vo?.id === record?.pivot?.variation_option_id
    //   )['title'];
    //   name = `${name} - ${variationTitle}`;
    // }
    return (
      <>
        <div className="flex items-center">
        <div className="w-16 h-16 flex flex-shrink-0 rounded overflow-hidden relative">
          <Image
            src={data?.image?.thumbnail ?? productPlaceholder}
            alt={data?.name}
            className="w-full h-full object-cover"
            layout="fill"
          />
        </div>

        <div className="flex flex-col ms-4 overflow-hidden">
          <div className="flex mb-1">
            <span className="text-sm text-body truncate inline-block overflow-hidden">
              {data?.name}
            </span>
            {/* <span className="text-sm text-heading font-semibold truncate inline-block overflow-hidden">
              {data?.unit}
            </span> */}
          </div>
          {/* <span className="text-sm text-accent font-semibold mb-1 truncate inline-block overflow-hidden">
            {price}
          </span> */}
          </div>
        </div>
      </>
    );
  }
};

export const OrderItems = ({ orderProductPivot }: any) => {
  const { t } = useTranslation('common');
  const { alignLeft, alignRight } = useIsRTL();
  const { data: orderStatusData } = useOrderStatusesQuery();
  const whole = useOrderStatusesQuery();
  const orderTableColumns = useMemo(() => {
    return [
      {
        title: <span className="ps-20">{t('text-item')}</span>,
        dataIndex: '',
        key: 'items',
        align: alignLeft,
        width: 200,
        ellipsis: true,
        render: OrderItemList,
      },
      {
        title: t('status'),
        dataIndex: 'status',
        key: 'status',
        align: alignLeft,
        width: 290,
        render: (status: any, item: any) => (
          <div className="my-5 lg:my-10 flex justify-center items-center">
            <ProgressBox
              data={orderStatusData?.order_statuses?.data}
              status={item?.status?.serial! || 1}
              // status={data?.order?.status?.serial!}
            />
          </div>
        ),
      },
      {
        title: t('text-quantity'),
        dataIndex: 'pivot',
        key: 'pivot',
        align: 'center',
        width: 100,
        render: function renderQuantity(pivot: any, item: any) {
          return <p className="text-base">{item?.order_quantity}</p>;
        },
      },
      {
        title: t('unit price'),
        dataIndex: 'pivot',
        key: 'price',
        align: alignRight,
        width: 100,
        render: function RenderPrice(pivot: any, item: any) {
          const { price } = usePrice({
            amount: item.unit_price,
          });
          return <p>{price}</p>;
        },
      },
      {
        title: t('total'),
        dataIndex: 'pivot',
        key: 'price',
        align: alignRight,
        width: 100,
        render: function RenderPrice(pivot: any, item: any) {
          const { price } = usePrice({
            amount: item.subtotal,
          });
          return <p>{price}</p>;
        },
      },
    ];
  }, [alignLeft, alignRight, t]);

  return (
    <>
      <Table
        //@ts-ignore
        columns={orderTableColumns}
        data={orderProductPivot}
        rowKey={(record: any) =>
          record.pivot?.variation_option_id
            ? record.pivot.variation_option_id
            : record.created_at
        }
        className="orderDetailsTable w-full"
        scroll={{ x: 350, y: 500 }}
      />
    </>
  );
};
