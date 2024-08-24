import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentPatients({ data }: { data: any }) {
  const getText = (text: string) => {
    return text[0].toUpperCase();
  };
  return (
    <div className="space-y-8">
      {data?.map((data: any, index: number) => (
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{getText(data?.fullname)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{data?.fullname}</p>
            <p className="text-sm text-muted-foreground">{data?.email}</p>
          </div>
          {/* <div className="ml-auto font-medium">+$1,999.00</div> */}
        </div>
      ))}
    </div>
  );
}
