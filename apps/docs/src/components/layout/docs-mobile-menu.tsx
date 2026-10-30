import { Dialog } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";

import { DocsBrand, DocsNavigation } from "@/components/layout/docs-navigation";

const DocsMobileMenu = ({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) => (
  <Dialog.Root
    defaultOpen
    onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}
  >
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-40 bg-zinc-950/35 lg:hidden" />
      <Dialog.Popup
        className="fixed inset-x-0 top-0 z-50 flex max-h-dvh flex-col border-b border-zinc-200 bg-zinc-50 px-5 py-4 font-sans text-zinc-700 shadow-lg outline-none lg:hidden"
        id={id}
        aria-label="Documentation menu"
      >
        <div className="flex shrink-0 items-center justify-between">
          <DocsBrand onNavigate={onClose} />
          <Dialog.Close
            className="icon-button relative isolate grid size-11 shrink-0 place-items-center rounded-lg text-zinc-500 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-brand"
            aria-label="Close navigation"
          >
            <span className="icon-button__icons size-5.5" aria-hidden="true">
              <XIcon size={22} focusable="false" />
            </span>
          </Dialog.Close>
        </div>
        <DocsNavigation
          className="mt-4 flex min-h-0 flex-col gap-1 overflow-y-auto overscroll-contain"
          onNavigate={onClose}
        />
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
);

export default DocsMobileMenu;
