import { useUpdateCustomerMutation } from '@framework/customer/customer.query';
import {
  useModalAction,
  useModalState,
} from '@components/ui/modal/modal.context';
import AddressForm from '@components/address/address-form';
import { AddressType } from '@framework/utils/constants';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { useQueryClient } from 'react-query';

type FormValues = {
  __typename?: string;
  title: string;
  type: AddressType;
  address: {
    country: string;
    city: string;
    state: string;
    zip: string;
    street_address: string;
  };
};

const CreateOrUpdateAddressForm = () => {
  const { t } = useTranslation('common');
  const {
    data: { customerId, address },
  } = useModalState();
  const { closeModal } = useModalAction();
  const { mutate: updateProfile } = useUpdateCustomerMutation();
  const queryClient = useQueryClient();

  function onSubmit(values: FormValues) {
    const formattedInput = {
      id: address?.id,
      customer_id: customerId,
      title: values.title,
      type: values.type,
      address: {
        ...(address?.id && { id: address.id }),
        ...values.address,
      },
    };

    updateProfile({
      id: customerId,
      address: [formattedInput],
    },
    {
      onSuccess: () => {
        toast.success(t('profile-update-successful'));
      },
      onError: (err) => {
        toast.error(t('error-something-wrong'));
      },
    });
    queryClient.invalidateQueries('me');
    closeModal();
  }
  return <AddressForm onSubmit={onSubmit} />;
};

export default CreateOrUpdateAddressForm;
