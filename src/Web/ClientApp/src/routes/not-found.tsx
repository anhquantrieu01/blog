import { paths } from '../config/paths';
import { Link } from 'react-router-dom';

const NotFoundRoute = () => {
  return (
    <div className="mt-52 flex flex-col items-center font-semibold">
      <h1>404 - Not Found</h1>
      <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to={paths.home.getHref()} replace>
        Quay lại Trang Chủ
      </Link>
    </div>
  );
};

export default NotFoundRoute;