import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState, Fragment } from "react";

export type FlashMessageType = "success" | "info" | "warning" | "error";

interface Props {
  title?: string;
  children: string;
  type?: FlashMessageType;
}

const Alert = ({ title, children, type }: Props) => {
  const [show, setShow] = useState<boolean>(true);

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl bg-white ring-1 shadow-lg ring-black/5 backdrop-blur-lg">
        <div className="p-4">
          <div className="flex items-start">
            <div className="shrink-0">
              {type === "error" ? (
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-red-400"
                  aria-hidden="true"
                />
              ) : type === "success" ? (
                <CheckCircleIcon
                  className="h-6 w-6 text-green-400"
                  aria-hidden="true"
                />
              ) : type === "warning" ? (
                <ShieldExclamationIcon
                  className="h-6 w-6 text-yellow-400"
                  aria-hidden="true"
                />
              ) : (
                <InformationCircleIcon
                  className="text-primary-400 h-6 w-6"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-black">{title}</p>
              <p className="mt-1 text-sm text-gray-700">{children}</p>
              {!children.toString().includes("average") && (
                <a
                  onClick={() => {
                    setShow(false);
                  }}
                  className="mt-3 text-xs text-gray-400 hover:text-sky-500"
                >
                  Never warn me again for this publication
                </a>
              )}
            </div>
            <div className="ml-4 flex shrink-0">
              <button
                type="button"
                className="inline-flex rounded-md text-gray-500 hover:text-gray-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-hidden"
                onClick={() => {
                  setShow(false);
                }}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};
Alert.displayName = "Alert";

export default Alert;
