
import Button from '@components/ui/button';
import { Form } from '@components/ui/forms/form';
import Input from '@components/ui/forms/input';
import TextArea from '@components/ui/forms/text-area';
import { useTranslation } from 'next-i18next';
import { SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { useForm, ValidationError } from '@formspree/react';

type ContactFormProps = {
  name: string;
  email: string;
  subject: string;
  description: string;
  _replyto: string;
};
interface Props {
  onSubmit: SubmitHandler<ContactFormProps>;
  loading: boolean;
}
const contactFormSchema = yup.object().shape({
  name: yup.string().required('error-name-required'),
  // email: yup
  //   .string()
  //   .email('error-email-format')
  //   .required('error-email-required'),
  _replyto: yup
    .string()
    .email('error-email-format')
    .required('error-email-required'),
  subject: yup.string().required('error-subject-required'),
  description: yup.string().required('error-description-required'),
});
const ContactForm = ({ onSubmit, loading }: Props) => {
  const { t } = useTranslation('common');
  const [state, handleSubmit] = useForm("mknyjazz");
  if (state.succeeded) {
    return <p>Thanks for joining!</p>;
  }

  return (
    <Form<ContactFormProps>
      id="my-form"
      action="https://formspree.io/f/mknyjazz"
      method="POST"
      onSubmit={handleSubmit}
    // validationSchema={contactFormSchema}
    >
      {({ register, formState: { errors } }) => (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label={t('text-name')}
              {...register('name')}
              variant="outline"
              // error={t(errors.name?.message!)}
              type="text"
              name="name"
            />
            <Input
              label={t('text-email')}
              {...register('_replyto')}
              type="email"
              variant="outline"
              // error={t(errors.email?.message!)}
              name="_replyto"
            />
          </div>
          <Input
            label={t('text-subject')}
            {...register('subject')}
            variant="outline"
            className="my-6"
            // error={t(errors.subject?.message!)}
            type="text"
            name="subject"
          />
          <TextArea
            label={t('text-description')}
            {...register('description')}
            variant="outline"
            className="my-6"
            // error={t(errors.description?.message!)}
            name="description"
          />

          <Button loading={loading} disabled={loading}>
            {t('text-submit')}
          </Button>
        </>
      )}
    </Form>
  );
};

export default ContactForm;
