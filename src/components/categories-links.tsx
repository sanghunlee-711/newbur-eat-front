import { CategoryParts } from '../__generated__/CategoryParts';
import CategoryLink from './category-link';

interface IProps {
  data: [CategoryParts];
}
export const CategoriesLink: React.FC<IProps> = ({ data }) => {
  return (
    <div className="flex justify-around  mx-w-sm mx-auto">
      {data?.map((category) => (
        <CategoryLink category={category} />
      ))}
    </div>
  );
};
