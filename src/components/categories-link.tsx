import { Link } from 'react-router-dom';
import { CategoryParts } from '../__generated__/CategoryParts';

interface IProps {
  data: [CategoryParts];
}
export const CategoriesLink: React.FC<IProps> = ({ data }) => {
  return (
    <div className="flex justify-around  mx-w-sm mx-auto">
      {data?.map((category) => (
        <Link to={`/category/${category.slug}`} key={category.name}>
          <div className="flex flex-col items-center cursor-pointer group">
            <div
              className="w-16 h-16 bg-cover rounded-full  group-hover:bg-gray-100 "
              style={{ backgroundImage: `url(${category.coverImg})` }}
            ></div>
            <span className="text-sm text-center font-medium mt-1">
              {category.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};
