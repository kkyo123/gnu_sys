import React from 'react';
import { Edit, BarChart3, Calendar, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { MyPageUser, AcademicData } from '@/types/mypage';
import { MYPAGE_SECTION_IDS, type MyPageSectionId } from '@/pages/Mypage/config';
import type { KeywordGroupKey } from '@/pages/Mypage/keywordConfig';

interface MyPageSidebarProps {
  user?: MyPageUser | null;
  academicData?: AcademicData | null;
  selectedKeywords: Record<KeywordGroupKey, string[]>;
  scrollToSection: (id: MyPageSectionId) => void;
  setIsProfileEditOpen: (open: boolean) => void;
  setIsKeywordEditOpen: (open: boolean) => void;
}

export const MyPageSidebar: React.FC<MyPageSidebarProps> = ({
  user,
  academicData,
  selectedKeywords,
  scrollToSection,
  setIsProfileEditOpen,
  setIsKeywordEditOpen,
}) => {
  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U';
  const userName = user?.name || '이름 없음';
  const userMajor = user?.major || '전공 미입력';
  const userStudentId = user?.id || '-';

  const currentCredits = academicData?.totalCredits.current ?? 0;
  const requiredCredits = academicData?.totalCredits.required ?? 0;

  const flattenedSelected = Object.values(selectedKeywords || {}).flat();

  return (
    <aside className="w-[260px] min-h-screen top-16 left-4 bg-white border-r z-20 px-3 py-6 fixed self-start">
      <div className="p-3 space-y-8">
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <Avatar className="h-20 w-20 mb-2">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-base">{userName}</h3>
              <p className="text-sm text-muted-foreground">{userMajor}</p>
              <p className="text-sm text-muted-foreground">{userStudentId}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsProfileEditOpen(true)}
                className="w-full"
              >
                <Edit className="h-3 w-3 mr-1" />
                프로필 수정
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div>
          <h4 className="text-sm text-muted-foreground mb-3">현재 학기</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">학기</span>
              <span className="font-medium">2025년 1학기</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">수강 학점</span>
              <span className="font-medium">15학점</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">이수 학점</span>
              <span className="font-medium">
                {currentCredits}/{requiredCredits}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm text-muted-foreground mb-3">선호 키워드</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {flattenedSelected.slice(0, 5).map((keyword) => (
              <Badge
                key={keyword}
                className="rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 px-3 py-1 text-xs"
              >
                #{keyword}
              </Badge>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sm"
            onClick={() => setIsKeywordEditOpen(true)}
          >
            키워드 관리
          </Button>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm text-muted-foreground mb-3">바로가기</h4>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => scrollToSection(MYPAGE_SECTION_IDS.creditOverview)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              학점 이수 현황
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => scrollToSection(MYPAGE_SECTION_IDS.timetable)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              시간표
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => scrollToSection(MYPAGE_SECTION_IDS.preferences)}
            >
              <Target className="h-4 w-4 mr-2" />
              선호 키워드 관리
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};
