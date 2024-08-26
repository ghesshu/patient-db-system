"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { useSidebar } from "@/hooks/useSidebar";
import { MdMedicalServices } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { IoPeopleSharp } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { RiMessage2Line } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import { RiCapsuleLine } from "react-icons/ri";
import { IoPersonAddOutline } from "react-icons/io5";
import { MdOutlineMedicalServices } from "react-icons/md";
import { signOut } from "next-auth/react";

const menu = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LuLayoutDashboard />,
    label: "Dashboard",
  },
  {
    title: "Patients",
    href: "/dashboard/patients",
    icon: <IoPersonAddOutline />,
    label: "patients",
  },
  {
    title: "Treatments",
    href: "/dashboard/treatment",
    icon: <MdOutlineMedicalServices />,
    label: "treatment",
  },
  {
    title: "Medicine",
    href: "/dashboard/medicine",
    icon: <RiCapsuleLine />,
    label: "medicine",
  },
  {
    title: "Campaigns",
    href: "/dashboard/campaigns",
    icon: <RiMessage2Line />,
    label: "campaign",
  },
];

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false,
}: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();

  if (!items?.length) {
    return null;
  }

  console.log("isActive", isMobileNav, isMinimized);

  return (
    <nav className="grid items-start gap-2">
      {menu.map((item: any, index: number) => (
        <div className="" key={index}>
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-2 overflow-hidden rounded-md py-5 text-sm font-medium hover:bg-primary/10 hover:text-accent-foreground",
              path === item.href ? "bg-primary/10 text-primary" : "transparent",
              item.disabled && "cursor-not-allowed opacity-80"
            )}
            onClick={() => {
              if (setOpen) setOpen(false);
            }}
          >
            {/* <Icon className={`ml-3 size-5 flex-none`} /> */}
            <div className="flex items-center justify-center ml-3 text-xl text-primary ">
              {item.icon}
            </div>

            {isMobileNav || (!isMinimized && !isMobileNav) ? (
              <span className="mr-2 truncate">{item.title}</span>
            ) : (
              ""
            )}
          </Link>
        </div>
      ))}
      <div className="w-full">
        <button
          onClick={() => {
            if (setOpen) setOpen(false);
            signOut({ callbackUrl: "/" });
          }}
          className={cn(
            "w-full flex items-center gap-2 overflow-hidden rounded-md py-5 text-sm font-medium hover:bg-primary/10 hover:text-accent-foreground"
          )}
        >
          {/* <Icon className={`ml-3 size-5 flex-none`} /> */}
          <div className="flex items-center justify-center ml-3 text-xl text-primary ">
            <IoIosLogOut />
          </div>

          {isMobileNav || (!isMinimized && !isMobileNav) ? (
            <span className="mr-2 truncate">Logout</span>
          ) : (
            ""
          )}
        </button>
      </div>
    </nav>
  );
}
