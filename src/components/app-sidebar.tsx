import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
  IconQrcode
} from "@tabler/icons-react"

import { NavMain } from "#/components/nav-main"
import { NavUser } from "#/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "#/components/ui/sidebar"
import { onAuthStateChanged, type User } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth, db } from "FirebaseConfig"
import { doc, getDoc } from "firebase/firestore"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Visitors",
      url: "/visitors",
      icon: IconListDetails,
    },
    {
      title: "Check-In",
      url: "/check-in",
      icon: IconQrcode,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<User | null>(auth.currentUser)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (snap.exists()) {
          setUsername(snap.data().username ?? '')
        }
      }
    })
    return () => unsubscribe()
  }, [])

  const userData = {
    name: username || user?.email?.split('@')[0] || '',
    email: user?.email ?? '',
    avatar: user?.photoURL ?? '',
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconInnerShadowTop className="size-5! text-foreground" />
                <span className="text-base text-foreground font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
