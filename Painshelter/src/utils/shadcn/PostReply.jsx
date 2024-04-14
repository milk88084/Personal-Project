import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PostReply() {
  return (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="est">辛苦了，給你一個擁抱</SelectItem>
          <SelectItem value="cst">
            謝謝你勇敢地分享，我們在這裡支持你
          </SelectItem>
          <SelectItem value="mst">
            你的故事讓人心疼，如果需要的話，我們隨時在這裡傾聽
          </SelectItem>
          <SelectItem value="pst">你不是一個人，我們在這裡為你加油</SelectItem>
          <SelectItem value="akst">
            每個人的感受都是獨特的，請記住有人願意陪伴你
          </SelectItem>
          <SelectItem value="hst">
            生命中有許多坎坷，但請相信自己的力量和價值
          </SelectItem>
          <SelectItem value="hst">
            即使前方的路看起來艱難，也有許多手將會伸出來幫助你
          </SelectItem>
          <SelectItem value="hst">
            辛苦了，世界因為有了你的勇氣而更加美好
          </SelectItem>
          <SelectItem value="hst">
            讓我們一起尋找光明，無論黑夜多麼漫長
          </SelectItem>
          <SelectItem value="hst">
            你的感受很重要，謝謝你願意和我們分擔
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
