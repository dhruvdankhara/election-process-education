import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

const getSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
};

const getServerSnapshot = () => false;

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(MOBILE_MEDIA_QUERY);
  const onChange = () => callback();
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
