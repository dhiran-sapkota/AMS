import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type props = {
  title: string;
  header: string;
  children: React.ReactNode;
  open: boolean;
  closeModal: () => void
  isLoading?: boolean;
};

export function Modal({ children, header, title, open, closeModal }: props) {
  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogTrigger asChild>
        <Button variant="outline">{header}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
