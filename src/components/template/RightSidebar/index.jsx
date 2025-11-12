// src/components/RightSidebar.jsx
import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Dialog, Transition } from "@headlessui/react";

// Local Imports (adjust paths to your project)
import { Button, ScrollShadow } from "components/ui";
import { useDisclosure } from "hooks";
import VerticalSliderIcon from "assets/dualicons/vertical-slider.svg?react";
import { Header } from "./Header";

/**
 * RightSidebar
 * - An icon button opens a right-side drawer
 * - Drawer uses Headless UI Dialog + Transition
 */

export function RightSidebar() {
  // useDisclosure returns [isOpen, { open, close }] in your codebase
  const [isOpen, { open, close }] = useDisclosure();

  return (
    <>
      <Button
        onClick={open}
        variant="flat"
        isIcon
        className="relative size-8 rounded-full"
        aria-label="Open settings"
        type="button"
      >
        <VerticalSliderIcon className="size-6" />
      </Button>

      <RightSidebarContent isOpen={isOpen} close={close} />
    </>
  );
}

function RightSidebarContent({ isOpen, close }) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={close} open={isOpen}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity dark:bg-black/40" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-200"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl dark:bg-dark-750">
                    <Header close={close} />

                    <ScrollShadow
                      size={4}
                      className="hide-scrollbar overflow-y-auto overscroll-contain pb-5"
                    >
                      <div className="px-4 py-5">
                        {/* Replace with your form / content */}
                        <div className="italic text-sm text-gray-600">Start magic form here</div>
                      </div>
                    </ScrollShadow>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

RightSidebarContent.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
};
