import { signIn } from 'next-auth/client';
import Logo from '@components/ui/logo';
import Alert from '@components/ui/alert';
import Input from '@components/ui/forms/input';
import PasswordInput from '@components/ui/forms/password-input';
import Button from '@components/ui/button';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import { GoogleIcon } from '@components/icons/google';
import { useModalAction } from '@components/ui/modal/modal.context';
import { MobileIcon } from '@components/icons/mobile-icon';
import { Form } from '@components/ui/forms/form';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface LoginFormProps {
  errorMessage: string;
  onSubmit: (formData: any) => void;
  loading: boolean;
}
type FormValues = {
  email: string;
  password: string;
};

const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('error-email-format')
    .required('error-email-required'),
  password: yup.string().required('error-password-required'),
});

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading,
  errorMessage,
}) => {
  const { t } = useTranslation('common');
  const { openModal } = useModalAction();
  const [errorMsg, setErrorMsg] = useState('');

  // const loginWithGoogle = async () => {
  //   await axios.get('http://localhost:5000/api/google');
  // };

  // const fetchAuthUser = async () => {
  //   // const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  //   // const url =
  //   //   'http://localhost:5000/api/google/login'; // site that doesn’t send Access-Control-*
  //   // fetch(proxyurl + url).then((resp) => resp.json())
  //   // .catch((err) => {
  //   //   console.log('error', err);
  //   //   console.log('Not properly authenticated');
  //   //   // dispatch(setIsAuthenticated(false));
  //   //   // dispatch(setAuthUser(null));
  //   //   // history.push("/login/error");
  //   // });
  //   const response = await axios
  //     .get('http://localhost:5000/api/google/login')
  //     .catch((err) => {
  //       console.log('error', err);
  //       console.log('Not properly authenticated');
  //       // dispatch(setIsAuthenticated(false));
  //       // dispatch(setAuthUser(null));
  //       // history.push("/login/error");
  //     });

  //   if (response && response.data) {
  //     console.log('User: ', response.data);
  //     // dispatch(setIsAuthenticated(true));
  //     // dispatch(setAuthUser(response.data));
  //     // history.push("/welcome");
  //   }
  // };

  // const redirectToGoogleSSO = async () => {
  //   let timer: NodeJS.Timeout | null = null;
  //   const googleLoginURL = 'http://localhost:5000/api/google';
  //   const newWindow = window.open(
  //     googleLoginURL,
  //     '_blank',
  //     'width=500,height=600'
  //   );

  //   if (newWindow) {
  //     timer = setInterval(() => {
  //       if (newWindow.closed) {
  //         console.log("Yay we're authenticated");
  //         fetchAuthUser();
  //         if (timer) clearInterval(timer);
  //       }
  //     }, 500);
  //   }
  // };

  return (
    <div className="py-6 px-5 sm:p-8 bg-light w-screen md:max-w-[480px] min-h-screen md:min-h-0 h-full md:h-auto flex flex-col justify-center md:rounded-xl">
      <div className="flex justify-center">
        <Logo />
      </div>
      <p className="text-center text-sm md:text-base text-body mt-4 sm:mt-5 mb-8 sm:mb-10">
        {t('login-helper')}
      </p>
      {errorMessage && (
        <Alert
          variant="error"
          message={t(errorMessage)}
          className="mb-6"
          closeable={true}
          onClose={() => setErrorMsg('')}
        />
      )}
      <Form<FormValues> onSubmit={onSubmit} validationSchema={loginFormSchema}>
        {({ register, formState: { errors } }) => (
          <>
            <Input
              label={t('text-email')}
              {...register('email')}
              type="email"
              variant="outline"
              className="mb-5"
              error={t(errors.email?.message!)}
            />
            <PasswordInput
              label={t('text-password')}
              {...register('password')}
              error={t(errors.password?.message!)}
              variant="outline"
              className="mb-5"
              forgotPageRouteOnClick={() => openModal('FORGOT_VIEW')}
            />
            <div className="mt-8">
              <Button
                className="w-full h-11 sm:h-12"
                loading={loading}
                disabled={loading}
              >
                {t('text-login')}
              </Button>
            </div>
          </>
        )}
      </Form>
      {/* End of forgot login form */}

      {/* <div className="flex flex-col items-center justify-center relative text-sm text-heading mt-8 sm:mt-11 mb-6 sm:mb-8">
        <hr className="w-full" />
        <span className="absolute start-2/4 -top-2.5 px-2 -ms-4 bg-light">
          {t('text-or')}
        </span>
      </div> */}

      {/* <div className="grid grid-cols-1 gap-4 mt-2">
        <Button
          className="!bg-social-google hover:!bg-social-google-hover !text-light"
          disabled={loading}
          onClick={() => {
            // redirectToGoogleSSO();
            // loginWithGoogle();
            signIn('google');
          }}
        >
          <GoogleIcon className="w-4 h-4 me-3" />
          {t('text-login-google')}
        </Button>

        <Button
          className="w-full h-11 sm:h-12 !bg-gray-500 hover:!bg-gray-600 !text-light"
          disabled={loading}
          onClick={() => openModal('OTP_LOGIN')}
        >
          <MobileIcon className="h-5 me-2 text-light" />
          {t('text-login-mobile')}
        </Button>
      </div> */}

      <div className="flex flex-col items-center justify-center relative text-sm text-heading mt-8 sm:mt-11 mb-6 sm:mb-8">
        <hr className="w-full" />
      </div>
      {<div></div>}
      <div className="text-sm sm:text-base text-body text-center">
        {t('text-no-account')}{' '}
        <button
          onClick={() => openModal('REGISTER')}
          className="ms-1 underline text-accent font-semibold transition-colors duration-200 focus:outline-none hover:text-accent-hover focus:text-accent-hover hover:no-underline focus:no-underline"
        >
          {t('text-register')}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
