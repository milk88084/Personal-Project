import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselDemo() {
  const pages = [
    {
      title: "Page 1",
      content: "我願意成為那個溫柔傾聽的存在。",
      number: 1,
    },
    {
      title: "Page 2",
      content: "我承諾以尊重為前提，絕不輕易對任何故事發表批評。",
      number: 2,
    },
    {
      title: "Page 3",
      content: "願每一份疼痛最都能找到他的安放之地，被溫柔地照看。",
      number: 3,
    },
  ];
  return (
    <Carousel className=" w-48  xl:w-96 ">
      <CarouselContent>
        {pages.map((page, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className=" h-64  p-6">
                  <span className="text-4xl font-semibold opacity-40">
                    {page.number}.
                  </span>
                  <p className="text-1xl mt-5 font-medium xl:text-2xl">
                    {page.content}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
