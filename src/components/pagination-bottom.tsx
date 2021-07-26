interface IProps {
  onPrevPageClick: () => void;
  onNextPageClick: () => void;
  page: number;
  totalPages: number | null | undefined;
}

export const PaginationBottom: React.FC<IProps> = ({
  onPrevPageClick,
  onNextPageClick,
  page,
  totalPages,
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
        Page {page} of {totalPages}
      </span>
      {page !== totalPages ? (
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
