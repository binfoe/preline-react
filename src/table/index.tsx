/**
 * 在 react-hooks-table 基础上封装的 Table 组件，目标是从 column 定义到 data 数据都做到 ts 强类型约束。
 * 也就是，当数据字段发生修改时，可以直接借助 vscode 的 Rename 能力精准且全面地自动替换。
 */

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnSort,
  SortDirection,
} from '@tanstack/react-table';
import { cx } from 'cva';
import { isFunction } from 'lodash-es';
import { useMemo, type CSSProperties, type ReactNode, FC, useState, useEffect } from 'react';
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';
import { Spin } from '../spin';
import { Pagination, PaginationProps } from '../pagination';

interface ClassNameProps<T> {
  /** <td> 元素上的 className */
  tdClassName?: string | ((v: T) => string);
  /** <th> 元素上的 className */
  thClassName?: string;
}
type TableColumnMeta<T> = ClassNameProps<T>;
export type TableColumnSort<T> = { id: keyof T; desc: boolean };
export type TableSortingProps<T> = {
  sorts?: TableColumnSort<T>[];
  onSortingChange?: (sorts: TableColumnSort<T>[]) => void;
};
export type TableColumn<T> = (
  | {
      id: string;
      // 如果指定的是 id，则 sorting 只需要 true/false，该 id 传递给 react-hook-table
      sorting?: boolean;
    }
  | {
      name: string;
      // 如果指定的是 name，则 sorting 必须传递一个属性指明当前排序的属性名。该属性作为 id 传递给 react-hook-table
      sorting?: keyof T;
    }
) & {
  render?: (r: T) => ReactNode;
  headerRender?: (columnDef: TableColumn<T>) => ReactNode;
} & ClassNameProps<T>;

export type TableSize = 'default' | 'small' | 'none';

export type TableProps<T> = {
  loading?: boolean;
  /** 表格是否有外边线，默认为 false */
  bordered?: boolean;
  hoverable?: boolean;
  striped?: boolean;
  size?: TableSize;
  columns: TableColumn<T>[];
  data?: T[];
  pagination?: PaginationProps;
  sorting?: TableSortingProps<T>;
  onRowClick?: (row: T) => void;
  /** 组件顶层 div 元素上的 className */
  className?: string;
  /** 组件顶层 div 元素上的 style */
  style?: CSSProperties;
  /** <table> 元素上的 className */
  tableClassName?: string;
  /** <tbody> 元素上的 className */
  tbodyClassName?: string;
  /** <thead> 元素上的 className */
  theadClassName?: string;
  /** <thead> -> <tr> 元素上的 className */
  headRowClassName?: string;
  /** <tbody> -> <tr> 元素上的 className */
  bodyRowClassName?: string | ((row: T) => string);
} & ClassNameProps<T>;

interface TableComponentClassNames {
  loading?: string;
  th?: string;
  td?: string;
}
const themeClassNames: {
  size: Record<TableSize, TableComponentClassNames>;
} = {
  size: {
    default: {
      loading: 'my-24 h-12',
      td: 'px-6 py-4',
      th: 'px-6 py-3',
    },
    small: {
      loading: 'my-12 h-6',
      td: 'px-4 py-2',
      th: 'px-4 py-2',
    },
    none: {
      loading: '',
      th: '',
      td: '',
    },
  },
};

const SortButton: FC<{
  sort: SortDirection | false;
  onClick?: (event: unknown) => void;
}> = ({ sort, onClick }) => {
  return (
    <button className='w-5' onClick={onClick}>
      {sort === 'asc' && <BsArrowUp className='h-5 w-5 text-blue-400' />}
      {sort === 'desc' && <BsArrowDown className='h-5 w-5 text-blue-400' />}
      {!sort && <BsArrowDown className='h-5 w-5 text-gray-300' />}
    </button>
  );
};

function Table<T>({
  columns,
  data: inputData,
  loading = false,
  bordered = false,
  hoverable = false,
  striped = false,
  size = 'default',
  style,
  onRowClick,
  pagination,
  sorting,
  ...classNames
}: TableProps<T>) {
  const tableColumns = useMemo(() => {
    // const helper = createColumnHelper();
    return columns.map((col) => {
      const { id, name } = col as { id?: string; name?: string };

      return {
        id: id || col.sorting || name,
        enableSorting: !!col.sorting,
        header: () => {
          return col?.headerRender ? col.headerRender(col) : name || '';
        },
        accessorFn: (v) => v,
        cell: ({ getValue }) => {
          return col?.render?.(getValue() as T);
        },
        meta: {
          thClassName: col.thClassName,
          tdClassName: col.tdClassName,
        },
      } as ColumnDef<T>;
    });
  }, [columns]);

  const [data, setData] = useState(() => inputData || []);

  useEffect(() => {
    if (inputData) {
      setData(inputData);
    }
  }, [inputData]);

  const table = useReactTable<T>({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange(valueOrUpdateFn) {
      const sorts =
        (isFunction(valueOrUpdateFn)
          ? valueOrUpdateFn((sorting?.sorts as ColumnSort[]) || [])
          : valueOrUpdateFn) || [];
      sorting?.onSortingChange?.(sorts as TableColumnSort<T>[]);
    },
    state: {
      sorting: (sorting?.sorts as ColumnSort[]) || [],
    },
  });

  const tableRows = table.getRowModel().rows;

  // console.log('render table');
  const [tdLoading, setTdLoading] = useState(loading);
  useEffect(() => {
    if (!loading) {
      setTdLoading(false);
    }
  }, [loading]);

  return (
    <div
      className={cx(
        'relative',
        bordered ? 'overflow-clip rounded-md border' : 'overflow-auto',
        classNames.className,
      )}
      style={style}
    >
      <table
        className={cx(
          'min-w-full divide-y divide-gray-200 dark:divide-gray-700',
          classNames.tableClassName,
        )}
      >
        <thead className={classNames.theadClassName}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={cx('bg-gray-50', classNames.headRowClassName)}>
              {headerGroup.headers.map((header) => {
                const thClassName =
                  (header.column.columnDef.meta as TableColumnMeta<T>)?.thClassName ||
                  classNames.thClassName;
                return (
                  <th
                    key={header.id}
                    className={cx(
                      themeClassNames.size[size].th,
                      'text-left text-xs font-medium text-gray-500',
                      thClassName,
                    )}
                  >
                    {header.column.getCanSort() ? (
                      <div className='flex items-center gap-1.5'>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <SortButton
                          sort={header.column.getIsSorted()}
                          onClick={() => {
                            // header.column.toggleSorting()
                          }}
                        />
                      </div>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody
          className={cx(
            'divide-y divide-gray-200 dark:divide-gray-700',

            classNames.tbodyClassName,
          )}
        >
          {tdLoading && (
            <tr>
              <td className={themeClassNames.size[size].td} colSpan={columns.length}>
                <div className='flex w-full items-center justify-center py-6 text-orange-400'>
                  <Spin />
                </div>
              </td>
            </tr>
          )}
          {!loading && data?.length === 0 && (
            <tr>
              <td colSpan={columns.length} className='h-24 text-center'>
                No results.
              </td>
            </tr>
          )}
          {tableRows.map((row) => {
            const rowValue = row.getAllCells()[0]?.getValue() as T;
            const trClassName = isFunction(classNames.bodyRowClassName)
              ? classNames.bodyRowClassName(rowValue)
              : classNames.bodyRowClassName;
            return (
              <tr
                key={row.id}
                className={cx(
                  striped &&
                    'odd:bg-white even:bg-gray-100 dark:odd:bg-gray-800 dark:even:bg-gray-700',
                  hoverable && 'hover:bg-gray-100 dark:hover:bg-gray-700',
                  trClassName,
                )}
                onClick={() => onRowClick?.(rowValue)}
              >
                {row.getVisibleCells().map((cell) => {
                  const classNameOrFn = (cell.column.columnDef.meta as TableColumnMeta<T>)
                    ?.tdClassName;
                  const cn = isFunction(classNameOrFn)
                    ? classNameOrFn(cell.getValue() as T)
                    : classNameOrFn;
                  return (
                    <td
                      key={cell.id}
                      className={cx(
                        themeClassNames.size[size].td,
                        'whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200',
                        cn,
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {pagination && <Pagination loading={loading} {...pagination} />}
    </div>
  );
}
export { Table };
