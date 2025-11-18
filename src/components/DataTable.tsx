import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Search, Plus, Edit, Trash2 } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onAdd?: () => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
}

export default function DataTable<T extends { id: number | string }>({
  columns,
  data,
  loading = false,
  pagination,
  onAdd,
  onEdit,
  onDelete,
  searchPlaceholder = '搜索...',
  onSearch,
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    onSearch?.(searchValue);
  };

  const getCellValue = (record: T, key: string) => {
    return (record as any)[key];
  };

  return (
    <div className="space-y-4">
      {/* 工具�?*/}
      <div className="flex items-center justify-between p-4 bg-[#252525] rounded-lg border border-[#333333]">
        <div className="flex items-center gap-2">
          {onSearch && (
            <div className="flex items-center gap-2">
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-64 bg-[#1e1e1e] border-[#333333] text-white"
              />
              <Button onClick={handleSearch} size="icon" variant="outline" className="border-[#333333] hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/50">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        {onAdd && (
          <Button onClick={onAdd} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            新增
          </Button>
        )}
      </div>

      {/* 表格 */}
      <div className="border border-[#333333] rounded-lg bg-[#1e1e1e] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#252525] hover:bg-[#252525] border-[#333333]">
              {columns.map((column, index) => (
                <TableHead key={index} className="text-white font-semibold">{column.title}</TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead className="text-right text-white font-semibold">操作</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length + 1} className="text-center py-12 text-gray-400">
                  加载�?..
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length + 1} className="text-center py-12 text-gray-400">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              data.map((record) => (
                <TableRow key={record.id} className="border-[#333333] hover:bg-[#252525] transition-colors">
                  {columns.map((column, index) => (
                    <TableCell key={index}>
                      {column.render
                        ? column.render(getCellValue(record, column.key as string), record)
                        : getCellValue(record, column.key as string)}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEdit(record)}
                            className="hover:bg-orange-500/10 hover:text-orange-500"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete(record)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between p-4 bg-[#252525] rounded-lg border border-[#333333]">
          <div className="text-sm text-gray-400 font-medium">
            �?<span className="text-white font-semibold">{pagination.total}</span> 条数�?
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
              disabled={pagination.current === 1}
              className="border-[#333333] hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm px-3 py-1 bg-orange-500/10 text-white rounded-md font-medium border border-orange-500/30">
              �?{pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)} �?
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              className="border-[#333333] hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
