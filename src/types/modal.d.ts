import * as React from "react";
export interface ModalProps {
  open: boolean;
  onClose: () => void;
}
declare const Modal: React.FC<ModalProps>;
export default Modal;
