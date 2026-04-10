import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  DoorOpen,
  CalendarPlus,
  CalendarCheck,
  Search,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import logoIcon from '@/assets/logo-icon.png';

const userNav = [
  { title: 'Tableau de bord', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Salles', url: '/rooms', icon: DoorOpen },
  { title: 'Réserver', url: '/reserve', icon: CalendarPlus },
  { title: 'Mes Réservations', url: '/my-reservations', icon: CalendarCheck },
  { title: 'Rechercher', url: '/available-rooms', icon: Search },
];

const adminNav = [
  { title: 'Tableau de bord', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Salles', url: '/rooms', icon: DoorOpen },
  { title: 'Rechercher', url: '/available-rooms', icon: Search },
];

const adminOnlyNav = [
  { title: 'Gérer les salles', url: '/admin/rooms', icon: Settings },
  { title: 'Réservations', url: '/admin/reservations', icon: CalendarCheck },
];

const AppSidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mainNav = isAdmin ? adminNav : userNav;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-6">
        {/* LOGO */}
        <div className={`px-4 mb-6 ${collapsed ? 'px-2' : ''}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
              <img src={logoIcon} alt="MeetSpace" className="w-full h-full object-contain" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-base font-bold text-sidebar-foreground tracking-tight">
                  MeetSpace
                </h1>
                <p className="text-[11px] text-sidebar-foreground/50">
                  Réservation de salles
                </p>
              </div>
            )}
          </div>
        </div>

        {/* NAVIGATION */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase text-[10px] tracking-widest">
            {!collapsed && 'Navigation'}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center text-sm rounded-lg px-2 py-2 transition ${
                          isActive
                            ? 'bg-sidebar-primary text-white font-semibold shadow'
                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent'
                        }`
                      }
                    >
                      <item.icon size={18} className="mr-2.5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ADMIN */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase text-[10px] tracking-widest">
              {!collapsed && 'Administration'}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {adminOnlyNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center text-sm rounded-lg px-2 py-2 transition ${
                            isActive
                              ? 'bg-sidebar-primary text-white font-semibold shadow'
                              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent'
                          }`
                        }
                      >
                        <item.icon size={18} className="mr-2.5 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* FOOTER USER */}
      <SidebarFooter className="p-4">
        <Separator className="mb-4 bg-sidebar-border" />

        {!collapsed && (
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sm font-bold text-sidebar-primary">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="overflow-hidden">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name || "Utilisateur"}
              </p>

              <p className="text-[11px] text-sidebar-foreground/50 truncate flex items-center gap-1">
                {isAdmin && <Shield size={10} />}
                {isAdmin ? 'Administrateur' : 'Utilisateur'}
              </p>
            </div>
          </div>
        )}

        {/* LOGOUT */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground/60 hover:text-red-500 hover:bg-red-500/10"
        >
          <LogOut size={18} className="mr-2" />
          {!collapsed && 'Déconnexion'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;