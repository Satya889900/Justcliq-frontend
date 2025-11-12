// src/components/Header.jsx
import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { Fragment } from "react";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/24/outline";

// Local imports - adjust to your project
import { Button } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";

/**
 * Header used INSIDE the RightSidebar panel
 * Styled to be compact and to match the soft appearance.
 */

export function Header({ close }) {
  // safe fallback if your context isn't available
  const localeCtx = useLocaleContext?.() ?? { locale: "en" };
  const now = dayjs().locale(localeCtx.locale).format("DD MMMM, YYYY");

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <CalendarIcon className="w-5 h-5 text-gray-500" />
        <span className="text-sm">{now}</span>
      </div>

      <Button
        onClick={close}
        variant="flat"
        isIcon
        className="size-6 rounded-full ltr:-mr-1 rtl:-ml-1"
        aria-label="Close"
      >
        <XMarkIcon className="w-4 h-4 text-gray-600" />
      </Button>
    </div>
  );
}

Header.propTypes = {
  close: PropTypes.func,
};
