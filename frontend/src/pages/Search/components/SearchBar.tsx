import { Search as SearchIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SearchBar({
  value,
  onChange,
  showFilters,
  onToggleFilters,
}: {
  value: string;
  onChange: (v: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="강의명, 교수명으로 검색하세요"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button variant="outline" onClick={onToggleFilters}>
        <Filter className="h-4 w-4 mr-2" />
        {showFilters ? '필터 숨기기' : '필터 보기'}
      </Button>
    </div>
  );
}
