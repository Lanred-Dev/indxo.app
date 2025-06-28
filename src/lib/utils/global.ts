import type { Session, SessionUser } from "$lib/documents";

export interface ViewportContext {
    isMobile: boolean;
    isLoading: boolean;
    content: HTMLElement | undefined;
}

export interface HeaderContext {
    height: number;
}

export interface SidebarContext {
    isVisible: boolean;
    width: number;
}

export interface SessionContext {
    session: Session | null;
    user: SessionUser;
}
