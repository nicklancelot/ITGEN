import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';
export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-slate-400 px-2">
                Platform
            </SidebarGroupLabel>

            <SidebarMenu className="mt-2 space-y-1">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                       <SidebarMenuButton asChild  isActive={isCurrentUrl(item.href)}  tooltip={{ children: item.title }}
                                className="
                                    flex items-center gap-3
                                    rounded-lg
                                    px-3 py-2
                                    text-sm
                                    transition
                                    
                                    data-[active=true]:bg-gradient-to-r
                                    data-[active=true]:from-blue-500
                                    data-[active=true]:to-emerald-500
                                    data-[active=true]:text-white
                                "
                            >
                            <Link href={item.href} prefetch>
                                {item.icon && (
                                    <item.icon className="h-4 w-4 opacity-80" />
                                )}
                                <span className="truncate">{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}