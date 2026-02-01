import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';

type PaginatorProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onGo: (p: number) => void;
  maxPages?: number;
};

export function Paginator({
  page,
  totalPages,
  onPrev,
  onNext,
  onGo,
  maxPages = 7,
}: PaginatorProps) {
  const pages = getPageRange(
    page,
    totalPages,
    Math.min(7, Math.ceil(totalPages / maxPages))
  );
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={page <= 1}
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onPrev();
            }}
          />
        </PaginationItem>

        {pages.map((p, i) =>
          p === '…' ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault();
                  if (p !== page) onGo(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            aria-disabled={page >= totalPages}
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) onNext();
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function getPageRange(
  current: number,
  total: number,
  max: number
): (number | '…')[] {
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '…')[] = [];
  const side = Math.floor((max - 3) / 2); // room for first, last, and two ellipses
  const start = Math.max(2, current - side);
  const end = Math.min(total - 1, current + side);

  pages.push(1);
  if (start > 2) pages.push('…');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push('…');
  pages.push(total);
  return pages;
}
