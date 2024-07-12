import { ReactNode } from "react";
import Button from "../Button";
import { Input } from "../Input";
import { Dialog, DialogContent, DialogTrigger } from "./Dialog";

function NewChatDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <form
          className="flex flex-col gap-4 items-center w-9/12 m-auto"
          method="dialog">
          <h3 className="text-center font-bold text-lg">New Chat</h3>
          <Input placeholder="Username" className="w-full" />
          <Button variant="filled" className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewChatDialog;
