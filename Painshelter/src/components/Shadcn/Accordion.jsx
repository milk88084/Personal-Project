import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";

export function AccordionDemo() {
  const navigate = useNavigate();
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>疼痛日記室</AccordionTrigger>
        <AccordionContent>
          當疼痛來訪，它不僅觸及我們身體的纖維，也觸動心靈的角落。每個疼痛的故事都蘊含了力量與深刻的個人體驗。在「疼痛日記室」書寫那些無聲的時刻，讓您的故事得到聆聽，讓您的經歷幫助他人找到共鳴與勇氣。這不僅是一個敘述疼痛的空間，更是發現治癒與希望的起點。
          <span onClick={() => navigate("/history")}>點擊進入</span>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>心靈緊急按鈕</AccordionTrigger>
        <AccordionContent>
          當心靈的負重讓你步履蹣跚，「心靈緊急按鈕」隨時待命，這是一處私密的空間，檢視自己並了解內心的重壓與陰霾。藉由一系列問題，幫助自己描繪出目前的情緒地圖，從而發現釋放壓力與驅散憂鬱的路徑。不必獨自堅持，與最真實的自己相處。
          <span onClick={() => navigate("/help")}>點擊進入</span>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>關於我們</AccordionTrigger>
        <AccordionContent>
          這裡彙集了那些勇於分享的靈魂們的聲音，每段故事都是一盞燈塔，照亮著相似道路上的旅人。每一段遭遇，每一個感受，在這裡，都會發現與之共鳴的回音。記住，每一段經歷，無論喜悅或是痛苦，都不應該孤獨承擔。
          <span onClick={() => navigate("/history")}>點擊進入</span>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
