export class PaginationQueryDto {
  page?: number = 1;
  limit?: number = 10;
}

export class PaginationMetaDto {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMetaDto;
}
