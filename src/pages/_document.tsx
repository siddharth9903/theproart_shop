import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import { i18n } from 'next-i18next';

export default class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return Document.getInitialProps(ctx);
  }
  render() {
    const { locale } = this.props.__NEXT_DATA__;
    const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';

    if (process.env.NODE_ENV !== 'production') {
      // i18n!.reloadResources(locale);
    }

    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap"
            rel="stylesheet"
          />
          {/* <script src="https://checkout.razorpay.com/v1/checkout.js" /> */}
          {/* <NextScript src="https://checkout.razorpay.com/v1/checkout.js" /> */}
        </Head>
        <body dir={dir}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
