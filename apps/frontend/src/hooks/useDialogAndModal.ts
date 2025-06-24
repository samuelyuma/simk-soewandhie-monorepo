import { create } from "zustand";

type DialogAndModalState = {
  isOpen: Record<string, boolean>;
  open: (type: string) => void;
  close: (type: string) => void;
};

const useDialogAndModal = create<DialogAndModalState>((set) => ({
  isOpen: {},
  open: (type) =>
    set((state) => ({
      isOpen: { ...state.isOpen, [type]: true },
    })),
  close: (type) =>
    set((state) => ({
      isOpen: { ...state.isOpen, [type]: false },
    })),
}));

export { useDialogAndModal };
