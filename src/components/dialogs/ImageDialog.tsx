import { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";

function ImageDialog({
  children,
  image,
}: {
  children: ReactNode;
  image: string;
}) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="p-0 overflow-hidden bg-transparent border-0 rounded-none">
        <DialogTitle className="hidden">Image</DialogTitle>
        <img src={image} alt="" className="z-50" />
      </DialogContent>
    </Dialog>
  );
}

export default ImageDialog;
