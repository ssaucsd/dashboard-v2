import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Home, MusicNoteSquare02Icon, Calendar, Book } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

const userActions = [
  {
    label: "Home",
    icon: Home,
    href: "/"
  },
  {
    label: "Events",
    icon: Calendar,
    href: "#"
  },
  {
    label: "Resources",
    icon: Book,
    href: "#"
  }
]

const adminActions = [
  {
    label: "Admin",
    icon: Home,
    href: "/admin"
  },
  {
    label: "Events",
    icon: Calendar,
    href: "#"
  },
  {
    label: "Resources",
    icon: Book,
    href: "#"
  }
]



export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={MusicNoteSquare02Icon} />
          <div className="font-bold text-lg">SSA at UCSD</div>
        </div>
      </SidebarHeader>
      <SidebarSeparator className="w-full" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>User Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userActions.map((action) => (
                <SidebarMenuItem key={action.label}>
                  <Link href={action.href}>
                    <SidebarMenuButton className="cursor-pointer">
                      <HugeiconsIcon icon={action.icon} strokeWidth={2} />
                      {action.label}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminActions.map((action) => (
                <SidebarMenuItem key={action.label}>
                  <Link href={action.href}>
                    <SidebarMenuButton className="cursor-pointer">
                      <HugeiconsIcon icon={action.icon} strokeWidth={2} />
                      {action.label}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}