import type { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
}

const Modal = ({ children }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-(--modal-bg) rounded-[12px] w-[343px] h-fit lg:w-[440px]">
        {children}
      </div>
    </div>
  );
};

export default Modal;
