import { CSSProperties, FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { cx } from 'cva';
import {
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
  BsChevronLeft,
  BsChevronRight,
  BsThreeDots,
} from 'react-icons/bs';
import { isNumber, isUndefined } from 'lodash-es';
import { isFunction } from '@tanstack/react-table';
import { Spin } from '../spin';
import { NumberInput } from '../input';
import { Select } from '../select';
import { calcFullPaginationInfo } from './helper';

export interface ShowTotalArg {
  total: number;
  start: number;
  end: number;
}
export interface PaginationProps {
  className?: string;
  style?: CSSProperties;
  /** 当前页码，从 0 开始计数 */
  pageNumber?: number;
  pageSize?: number;
  total?: number;
  loading?: boolean;
  itemCount?: number;
  useJumper?: boolean;
  showTotal?: boolean | ((info: ShowTotalArg) => ReactNode);

  disabled?: boolean;
  hideSinglePage?: boolean;
  pageSizeOptions?: boolean | number[];
  onChange?: (pageNumber: number, pageSize: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
  className,
  style,
  hideSinglePage = false,
  pageSizeOptions = true,
  pageNumber,
  pageSize,
  total,
  loading = false,
  itemCount = 7,
  disabled = false,
  useJumper = true,
  showTotal = false,
  onChange,
}) => {
  const ctrl = useRef(!isUndefined(pageNumber)); // 是否受控模式
  const [currentPage, setCurrentPage] = useState(isNumber(pageNumber) ? pageNumber + 1 : 1);
  const [currentSize, setCurrentSize] = useState(pageSize || 10);
  const [ipt, setIpt] = useState<number>(1);

  useEffect(() => {
    let n = isUndefined(pageNumber) ? 1 : pageNumber + 1;
    n = n <= 0 ? 1 : n;
    setCurrentPage(n);
  }, [pageNumber]);
  useEffect(() => {
    setCurrentSize(pageSize || 10);
  }, [pageSize]);

  const [info, setInfo] = useState(() =>
    calcFullPaginationInfo(currentPage, currentSize, total, itemCount),
  );
  useEffect(() => {
    if (!isNumber(total)) return;
    // console.log(currentPage, currentSize, total, itemCount);
    setInfo(calcFullPaginationInfo(currentPage, currentSize, total, itemCount));
  }, [currentPage, currentSize, total, itemCount]);

  const changePage = (page: number) => {
    if (page <= 0) {
      page = 1;
    } else if (page > info.totalPage) {
      page = info.totalPage;
    }
    if (page === currentPage) {
      return;
    }
    if (!ctrl.current) {
      setCurrentPage(page);
    }
    onChange?.(page - 1, currentSize);
  };

  const cls = (n: number) =>
    cx(
      'inline-flex justify-center items-center rounded-[16px] px-2 h-8 min-w-[32px] text-sm font-medium disabled:text-gray-300 disabled:cursor-not-allowed',
      n > 0 && currentPage === n ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-blue-500',
    );

  const renderTotal = () => {
    if (isFunction(showTotal)) {
      return showTotal({ total: total || 0, start: 0, end: 0 });
    } else {
      return <span className='mr-1'>共计 {total || 0} 条数据</span>;
    }
  };

  const opts = useMemo(() => {
    if (!pageSizeOptions) return [];
    return (Array.isArray(pageSizeOptions) ? pageSizeOptions : [10, 20, 30, 50, 70, 100]).map(
      (s) => {
        return {
          label: `${s}条/页`,
          value: s,
        };
      },
    );
  }, [pageSizeOptions]);

  if (hideSinglePage && !total) {
    return null;
  }
  return (
    <div
      className={cx('flex items-center justify-end gap-1 text-sm text-gray-500', className)}
      style={style}
    >
      {showTotal && renderTotal()}

      <button
        className={cls(0)}
        disabled={disabled || currentPage <= 1}
        onClick={() => {
          if (loading) return;
          changePage(currentPage - 1);
        }}
      >
        <BsChevronLeft />
      </button>
      {info.totalPage > 0 && (
        <button
          className={cls(1)}
          disabled={disabled}
          onClick={() => {
            if (loading || currentPage <= 1) {
              return;
            }
            changePage(1);
          }}
        >
          {loading && currentPage === 1 ? <Spin /> : '1'}
        </button>
      )}
      {info.items.length > 0 && info.items[0] > 2 && (
        <button
          className={cx(cls(0), '[&>svg:first-child]:hover:hidden [&>svg:last-child]:hover:block')}
          disabled={disabled}
          onClick={() => {
            if (loading) return;
            changePage(currentPage - itemCount + 2);
          }}
        >
          <BsThreeDots />
          <BsChevronDoubleLeft className='hidden' />
        </button>
      )}
      {info.items.map((item) => (
        <button
          key={item}
          className={cls(item)}
          disabled={disabled}
          onClick={() => {
            if (loading || item === currentPage || item < 1 || item > info.totalPage) {
              return;
            }
            changePage(item);
          }}
        >
          {loading && currentPage === item ? <Spin /> : item}
        </button>
      ))}
      {info.items.length > 0 && info.items[info.items.length - 1] < info.totalPage - 1 && (
        <button
          disabled={disabled}
          className={cx(cls(0), '[&>svg:first-child]:hover:hidden [&>svg:last-child]:hover:block')}
          onClick={() => {
            if (loading) return;
            changePage(currentPage + itemCount - 2);
          }}
        >
          <BsThreeDots />
          <BsChevronDoubleRight className='hidden' />
        </button>
      )}
      {info.totalPage > 1 && (
        <button
          disabled={disabled}
          className={cls(info.totalPage)}
          onClick={() => {
            if (loading || currentPage === info.totalPage) return;
            changePage(info.totalPage);
          }}
        >
          {loading && currentPage === info.totalPage ? <Spin /> : info.totalPage}
        </button>
      )}
      <button
        className={cls(0)}
        disabled={disabled || currentPage >= info.totalPage}
        onClick={() => {
          if (loading) return;
          changePage(currentPage + 1);
        }}
      >
        <BsChevronRight />
      </button>
      {pageSizeOptions && (
        <Select
          value={currentSize}
          options={opts}
          className='w-28'
          valueRender={(v) => `${v}条/页`}
          onChange={(v) => {
            setIpt(1);
            if (ctrl.current) {
              onChange?.(0, v);
            } else {
              setCurrentPage(1);
              setCurrentSize(v);
            }
          }}
        />
      )}
      {useJumper && (
        <label className='ml-1 flex items-center'>
          跳至
          <NumberInput
            type='number'
            size='xsmall'
            className='mx-2'
            min={1}
            max={info.totalPage}
            disabled={disabled || loading}
            value={ipt}
            onChange={(v) => {
              setIpt(v);
            }}
            onBlur={() => {
              if (ipt && ipt !== currentPage) {
                changePage(ipt);
              }
            }}
            onEnterPress={() => {
              if (ipt && ipt !== currentPage) {
                changePage(ipt);
              }
            }}
          />
          页
        </label>
      )}
    </div>
  );
};
