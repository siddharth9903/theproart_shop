import { useTranslation } from 'next-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { ContactType, CustomerService, CustomerType } from './customer.service';

export const useUpdateCustomerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (input: CustomerType) => CustomerService.updateCustomer(input),
    {
      // Always refetch after error or success:
      onSuccess: () => {
        queryClient.invalidateQueries('me');
      },
      onSettled: () => {
        queryClient.invalidateQueries('me');
      },
    }
  );
};

export const useContactMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutation((input: ContactType) => CustomerService.contact(input), {
    onSettled: () => {
      queryClient.invalidateQueries('me');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries('me');
      if (data.success) {
        toast.success(t(data.message));
      } else {
        toast.error(t(data.message));
      }
    },
  });
};
