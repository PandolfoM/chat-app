import { ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./Dialog";

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
      <DialogContent className="p-0 overflow-visible bg-transparent border-0 rounded-none max-h-full max-w-[85%]">
        <DialogTitle className="hidden">Image</DialogTitle>
        {/* <div className="h-full"> */}
        <img src={image} alt="" className="object-contain h-full" />
        {/* </div> */}
      </DialogContent>
    </Dialog>
  );
}

export default ImageDialog;
