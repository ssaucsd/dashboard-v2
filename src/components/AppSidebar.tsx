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
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={MusicNoteSquare02Icon} />
          <div className="font-bold text-lg group-data-[collapsible=icon]:hidden">SSA at UCSD</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>User Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userActions.map((action) => (
                <SidebarMenuItem key={action.label}>
                  <SidebarMenuButton tooltip={action.label} className="cursor-pointer" render={<Link href={action.href} />}>
                    <HugeiconsIcon icon={action.icon} strokeWidth={2} />
                    <span>{action.label}</span>
                  </SidebarMenuButton>
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
                  <SidebarMenuButton tooltip={action.label} className="cursor-pointer" render={<Link href={action.href} />}>
                    <HugeiconsIcon icon={action.icon} strokeWidth={2} />
                    <span>{action.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}