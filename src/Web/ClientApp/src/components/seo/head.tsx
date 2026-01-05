import { Helmet, HelmetData } from 'react-helmet-async';

type HeadProps = {
  title?: string;
  description?: string;
};

const helmetData = new HelmetData({});

 const Head = ({ title = '', description = '' }: HeadProps = {}) => {
  return (
    <Helmet
      helmetData={helmetData}
      title={title ? `${title} | Blog` : undefined}
      defaultTitle="Blog"
    >
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Head