import { restaurantsPageQuery } from '../__generated__/restaurantsPageQuery';

interface IProps {
  onPrevPageClick: () => void;
  onNextPageClick: () => void;
  page: number;
  data: restaurantsPageQuery | undefined;
}

export const PaginationBottom: React.FC<IProps> = ({
  onPrevPageClick,
  onNextPageClick,
  page,
  data,
}) => {
  return (
    <div className="grid grid-cols-3 text-center max-w-md item-center mx-auto">
      {page > 1 ? (
        <button
          className="focus:outline-none font-medium text-2xl"
          onClick={onPrevPageClick}
        >
          &larr;
        </button>
      ) : (
        <div></div>
      )}

      <span className="mx-5">
        Page {page} of {data?.restaurants.totalPages}
      </span>
      {page !== data?.restaurants.totalPages ? (
        <button
          className="focus:outline-none font-medium text-2xl"
          onClick={onNextPageClick}
        >
          &rarr;
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );
};
