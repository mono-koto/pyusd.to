import {
  useLocationProperty,
  navigate,
  BaseLocationHook,
} from "wouter/use-location";

// returns the current hash location in a normalized form
// (excluding the leading '#' symbol)
const hashLocation = () => window.location.hash.replace(/^#/, "") || "/";

const hashNavigate = (to: string) => navigate("#" + to);

export const useHashLocation: BaseLocationHook = () => {
  const location = useLocationProperty(hashLocation);
  return [location, hashNavigate];
};
