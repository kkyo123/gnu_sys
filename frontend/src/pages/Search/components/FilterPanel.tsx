import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { FilterState } from '../types';

export function FilterPanel({
  departments,
  days,
  times,
  selectedDepartment,
  setSelectedDepartment,
  selectedDay,
  setSelectedDay,
  selectedTime,
  setSelectedTime,
  selectedFilters,
  onFilterChange,
}: {
  departments: string[];
  days: string[];
  times: string[];
  selectedDepartment: string;
  setSelectedDepartment: (v: string) => void;
  selectedDay: string;
  setSelectedDay: (v: string) => void;
  selectedTime: string;
  setSelectedTime: (v: string) => void;
  selectedFilters: FilterState;
  onFilterChange: (key: keyof FilterState, checked: boolean) => void;
}) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>학과</Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger><SelectValue placeholder="학과 선택" /></SelectTrigger>
              <SelectContent>
                {departments.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>요일</Label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger><SelectValue placeholder="요일 선택" /></SelectTrigger>
              <SelectContent>
                {days.map((day) => <SelectItem key={day} value={day}>{day}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>시간</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger><SelectValue placeholder="시간 선택" /></SelectTrigger>
              <SelectContent>
                {times.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-3">분류</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(Object.entries(selectedFilters) as [keyof FilterState, boolean][]).map(([key, checked]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox id={String(key)} checked={checked} onCheckedChange={(v) => onFilterChange(key, Boolean(v))} />
                <Label htmlFor={String(key)} className="text-sm">
                  {key === 'balancedGeneral' && '균형교양'}
                  {key === 'basicGeneral' && '기초교양'}
                  {key === 'coreGeneral' && '핵심교양'}
                  {key === 'teacherTraining' && '교직'}
                  {key === 'generalElective' && '일반선택'}
                  {key === 'majorRequired' && '전공필수'}
                  {key === 'majorElective' && '전공선택'}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
