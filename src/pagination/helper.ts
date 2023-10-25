import { isUndefined } from 'lodash-es';

export function calcFullPaginationInfo(
  pageNumber: number,
  pageSize: number,
  totalSize: number | undefined,
  itemCount: number,
) {
  if (isUndefined(totalSize)) {
    totalSize = 0;
  }
  const totalPage = Math.ceil(totalSize / pageSize);
  if (totalPage <= 1) {
    return {
      totalPage,
      items: [],
    };
  }
  if (pageNumber > totalPage) {
    pageNumber = totalPage > 1 ? totalPage : 1;
  }

  const halfIc = (itemCount / 2) | 0;
  const left = pageNumber - 1;
  const right = totalPage - pageNumber;
  let start = 0;
  let end = 0;
  if (left <= right && left < halfIc) {
    start = 2;
    end = Math.min(itemCount, totalPage) - 1;
  } else if (left > right && right < halfIc) {
    end = totalPage - 1;
    start = Math.max(totalPage - itemCount + 1, 1) + 1;
  } else {
    start = pageNumber - halfIc + 1;
    end = pageNumber + halfIc - 1;
  }
  // if (end - start + 1 < 0) {
  //   debugger;
  // }
  const items = new Array(end - start + 1).fill(0).map((n, i) => i + start);
  return {
    totalPage,
    items,
  };
}
