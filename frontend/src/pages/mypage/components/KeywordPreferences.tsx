import React from 'react';
import { Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { KeywordPrefs } from '@/types/mypage';
import { KEYWORD_GROUPS, type KeywordGroupKey } from '@/pages/Mypage/keywordConfig';

interface KeywordPreferencesProps {
  prefs: KeywordPrefs;
  onEdit: () => void;
}

export const KeywordPreferences: React.FC<KeywordPreferencesProps> = ({ prefs, onEdit }) => (
  <Card className="shadow-sm">
    <CardContent className="pt-6 pb-5">
      <h4 className="mb-4">현재 선호 키워드</h4>

      {(
        Object.keys(KEYWORD_GROUPS) as KeywordGroupKey[]
      ).map((groupKey) => {
        const group = KEYWORD_GROUPS[groupKey];
        const selected = prefs.selected?.[groupKey] ?? [];
        if (!selected.length) return null;
        return (
          <div key={groupKey} className="mb-4">
            <h5 className="text-sm text-muted-foreground mb-2">{group.label}</h5>
            <div className="flex flex-wrap gap-2">
              {selected.map((keyword) => (
                <Badge key={keyword} className="rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 px-4 py-2">
                  #{keyword}
                </Badge>
              ))}
            </div>
          </div>
        );
      })}

      <p className="text-xs text-muted-foreground mb-4">키워드가 많아지면 추천 정확도가 낮아질 수 있습니다.</p>
      <Button variant="outline" onClick={onEdit}>
        <Edit className="h-4 w-4 mr-2" />
        선호 키워드 수정하기
      </Button>
    </CardContent>
  </Card>
);
