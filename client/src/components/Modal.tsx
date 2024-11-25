import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cx } from "class-variance-authority";
import React from "react";

type props = {
  title: string;
  header: string;
  children: React.ReactNode;
  open: boolean;
  closeModal: () => void
  isLoading?: boolean;
};

export const Modal: React.FC<props & React.HTMLAttributes<HTMLDivElement>> = ({ children, header, title, open, closeModal, ...props }) => {
  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogTrigger asChild>
        <Button variant="outline">{header}</Button>
      </DialogTrigger>
      <DialogContent className={cx("sm:max-w-[425px]", props.className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}