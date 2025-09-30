import QA_MONTH from "@/data/texts/qa_month";
import QA_NUMBER from "@/data/texts/qa_number";
import QA_NUMBER11 from "@/data/texts/qa_number11";
import QA_STEP1 from "@/data/texts/qa_step1";
import QA_WEEK from "@/data/texts/qa_week";
import type { MapPoint } from "@/types/index";

export const TYPING_ROUTE_POINTS: MapPoint[] = [
  { id: 1, x: 2724, y: 1768, title: "1～10までの数字", QA: QA_NUMBER },
  { id: 2, x: 2224, y: 1976, title: "11～20までの数字", QA: QA_NUMBER11 },
  { id: 3, x: 3352, y: 1396, title: "月の名前", QA: QA_MONTH },
  { id: 4, x: 3225, y: 1946, title: "曜日の名前", QA: QA_WEEK },
  { id: 5, x: 2850, y: 1390, title: "ステップ1", QA: QA_STEP1 },
];
