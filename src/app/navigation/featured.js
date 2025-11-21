import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from "constants/app.constant";
import { StarIcon } from "@heroicons/react/24/outline";

const ROOT_FEATURED = "/featured";

export const featuredRoutesNavigation = {
  id: "featured",
  type: NAV_TYPE_ROOT,
  path: ROOT_FEATURED,
  title: "Featured",
  transKey: "Featured",
  Icon: StarIcon,
  childs: [
    {
      id: "featured.home",
      path: ROOT_FEATURED,     // <-- FIXED
      type: NAV_TYPE_ITEM,
      title: "Featured Home",
      transKey: "Featured Home",
      Icon: StarIcon,
    },
  ],
};
