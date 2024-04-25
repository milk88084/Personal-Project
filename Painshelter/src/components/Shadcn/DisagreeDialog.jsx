import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-gray-400 p-2.5 h-12 rounded-xl font-normal  hover:bg-gray-900 hover:text-white"
          variant="outline"
        >
          溫柔宣言
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-300 w-96 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">溫柔宣言</DialogTitle>
        </DialogHeader>
        <div className="mt-5">
          <p className=" hover:text-gray-500">我願意成為那個溫柔傾聽的存在。</p>
          <p className="mt-5 hover:text-gray-500">我承諾以尊重為前提</p>
          <p className=" hover:text-gray-500">絕不輕易對任何故事發表批評。</p>
          <p className="mt-5 hover:text-gray-500">
            願每一份疼痛最都能找到他的安放之地
          </p>
          <p className=" hover:text-gray-500">被溫柔地照看。</p>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
