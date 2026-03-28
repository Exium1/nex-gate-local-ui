import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("live", "routes/live.tsx"),
  route("results", "routes/results.tsx")
] satisfies RouteConfig;
