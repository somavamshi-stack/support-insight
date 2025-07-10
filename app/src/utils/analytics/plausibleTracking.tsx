import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { usePlausible } from "next-plausible";
import { getSessionId } from "../auth";

interface PlausibleContextType {
    trackEvent: (eventName: string, props?: Record<string, any>) => void;
}

declare global {
    interface Window {
        plausible?: (eventName: string, options?: any) => void;
        __originalPlausible?: (eventName: string, options?: any) => void;
    }
}

const PlausibleContext = createContext<PlausibleContextType | undefined>(undefined);

export const usePlausibleTracking = () => {
    const context = useContext(PlausibleContext);
    if (!context) {
        throw new Error("usePlausibleTracking must be used within a PlausibleProvider");
    }
    return context;
};

const throttle = (fn: any, delay: number) => {
    let lastCall = 0;
    return (...args: any[]) => {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        return fn(...args);
    };
};

export const GlobalEventTracking = ({ userId }: { userId?: string }) => {
    const { trackEvent } = usePlausibleTracking();
    const lastPathRef = useRef<string>("");
    const routerRef = useRef<any>(null);
    const cleanupRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        // Prevent multiple initializations
        if (cleanupRef.current) return;

        if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            if (currentPath !== lastPathRef.current) {
                lastPathRef.current = currentPath;
                trackEvent("pagevisit", { path: currentPath, userId });
            }
        }

        const handleRouteChange = (url: string) => {
            if (url !== lastPathRef.current) {
                lastPathRef.current = url;
                trackEvent("pagevisit", { path: url, userId });
            }
        };

        const handleClick = throttle((e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const superTokensRoot = document.getElementById("supertokens-root");
            const isSuperTokensForm = superTokensRoot?.shadowRoot?.contains(target) || false;
            if (isSuperTokensForm) return;

            const closestInteractive = target.closest('button, a, [role="button"], [data-track="true"]') as HTMLElement;

            trackEvent("click", {
                element: target.tagName.toLowerCase(),
                elementId: target.closest("[id]")?.id || undefined,
                elementClass: typeof target.className === "string" ? target.className : undefined,
                elementText: target.textContent?.trim() || undefined,
                isInteractive: !!closestInteractive,
                interactiveType: closestInteractive?.tagName.toLowerCase(),
                userId
            });
        }, 200);

        const handleInput = throttle((e: Event) => {
            const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
            const superTokensRoot = document.getElementById("supertokens-root");
            const isSuperTokensForm = superTokensRoot?.shadowRoot?.contains(target) || false;
            if (isSuperTokensForm) return;
            if (!target.tagName) return;

            trackEvent("input_change", {
                element: target.tagName.toLowerCase(),
                elementId: target.id || undefined,
                elementName: target.name || undefined,
                inputValue: target.value || undefined,
                inputType: target.type || undefined,
                userId
            });
        }, 1000);

        // Add event listeners
        const eventListeners = [
            { type: "click", handler: handleClick, options: { passive: true } },
            { type: "input", handler: handleInput, options: { passive: true } },
            { type: "change", handler: handleInput, options: { passive: true } }
        ];

        eventListeners.forEach(({ type, handler, options }) => {
            document.addEventListener(type, handler as EventListener, options);
        });

        // Add router listener
        if (typeof window !== "undefined") {
            import("next/router")
                .then(({ default: NextRouter }) => {
                    if (!routerRef.current) {
                        routerRef.current = NextRouter;
                        NextRouter.events.on("routeChangeComplete", handleRouteChange);
                    }
                })
                .catch(console.error);
        }

        // Create cleanup function
        cleanupRef.current = () => {
            // Remove event listeners
            eventListeners.forEach(({ type, handler }) => {
                document.removeEventListener(type, handler as EventListener);
            });

            // Remove router listener
            if (routerRef.current) {
                routerRef.current.events.off("routeChangeComplete", handleRouteChange);
                routerRef.current = null;
            }
        };

        return cleanupRef.current;
    }, [trackEvent, userId]);

    return null;
};

export const PlausibleWrapper = ({ children, userId }: { children: React.ReactNode; userId?: string }) => {
    const plausible = usePlausible();
    const sessionId = getSessionId();

    // Store the original plausible function safely
    const originalPlausibleRef = useRef<((eventName: string, options?: any) => void) | null>(null);
    const isInitializedRef = useRef(false);

    // Capture the original plausible function on first render
    useEffect(() => {
        if (plausible && !originalPlausibleRef.current) {
            originalPlausibleRef.current = plausible;

            // Also store it globally as a backup
            if (typeof window !== "undefined" && !window.__originalPlausible) {
                window.__originalPlausible = plausible;
            }
        }
    }, [plausible]);

    const trackEvent = useCallback(
        (eventName: string, props: Record<string, any> = {}) => {
            // Use the stored original function or fallback to global backup
            const plausibleFn = originalPlausibleRef.current || window.__originalPlausible;

            if (!plausibleFn) {
                console.warn("Plausible is not initialized");
                return;
            }

            try {
                const enhancedProps = { ...props, sessionId: sessionId || "" };
                plausibleFn(eventName, { props: enhancedProps });
            } catch (error) {
                console.error("Error tracking event:", eventName, error);
                // Don't rethrow to prevent breaking the app
            }
        },
        [sessionId]
    );

    const contextValue = useMemo(() => ({ trackEvent }), [trackEvent]);

    // Set up global plausible function - only once
    useEffect(() => {
        if (typeof window !== "undefined" && !isInitializedRef.current && originalPlausibleRef.current) {
            isInitializedRef.current = true;

            // Only override if window.plausible doesn't already exist or is the default
            if (!window.plausible || window.plausible === window.__originalPlausible) {
                window.plausible = (eventName, options) => {
                    trackEvent(eventName, options?.props || {});
                };
            }

            return () => {
                // Cleanup: restore original or delete
                if (typeof window !== "undefined") {
                    if (window.__originalPlausible) {
                        window.plausible = window.__originalPlausible;
                    } else {
                        delete window.plausible;
                    }
                }
                isInitializedRef.current = false;
            };
        }
    }, [trackEvent, originalPlausibleRef.current]);

    // Don't render provider if no sessionId
    if (!sessionId) return <>{children}</>;

    return (
        <PlausibleContext.Provider value={contextValue}>
            <GlobalEventTracking userId={userId} />
            {children}
        </PlausibleContext.Provider>
    );
};
