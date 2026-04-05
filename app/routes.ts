import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("results", "routes/results.tsx"),
  layout("routes/race-layout.tsx", [
    route("live", "routes/live.tsx"),
  ]),
] satisfies RouteConfig;
