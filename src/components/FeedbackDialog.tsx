"use client";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FeedbackDialogProps = {
  open: boolean;
  onClose: () => void;
};

function FeedbackDialog({ open, onClose }: FeedbackDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("feedback.title")}</DialogTitle>
          <DialogDescription>
            {t("feedback.description")}
            <span className="block mt-2 font-medium">{t("feedback.email")}</span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default FeedbackDialog; 