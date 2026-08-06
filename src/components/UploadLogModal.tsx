import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/categories";
import { useCreateLog } from "@/hooks/useMarketplace";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function UploadLogModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const createLog = useCreateLog();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const reset = () => {
    setFile(null);
    setPreview(null);
    setCategory("");
    setDescription("");
    setPrice("");
  };

  const pickFile = (next: File | undefined) => {
    if (!next) return;
    if (!next.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setFile(next);
    setPreview(URL.createObjectURL(next));
  };

  const submit = async () => {
    if (!user) {
      toast.error("Sign in to upload a log.");
      return;
    }
    if (!file) {
      toast.error("Add an image of the log.");
      return;
    }
    if (!category) {
      toast.error("Choose a category.");
      return;
    }
    try {
      await createLog.mutateAsync({
        file,
        category,
        description: description.trim(),
        price: Number(price) || 0,
      });
      toast.success("Log uploaded to the marketplace.");
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Upload log</DialogTitle>
          <DialogDescription>
            Add an image, pick a category, and it lands in that marketplace section.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Log image</Label>
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pickFile(e.dataTransfer.files?.[0]);
              }}
              className={cn(
                "relative grid min-h-44 cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-surface/60 p-4 text-center transition-colors",
                dragging && "border-primary bg-primary/10",
              )}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Selected log preview"
                    className="max-h-56 w-full rounded-xl object-contain"
                  />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-background/80 text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </>
              ) : (
                <div className="space-y-1">
                  <ImagePlus className="mx-auto size-8 text-primary" />
                  <p className="text-sm font-medium">Drag & drop an image here</p>
                  <p className="text-xs text-muted-foreground">or click to browse — PNG, JPG</p>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="flex items-center gap-2">
                      <c.icon className="size-4" />
                      {c.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe the log — country, quality, age, extras…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              inputMode="decimal"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <Button
            className="w-full rounded-full"
            onClick={() => void submit()}
            disabled={createLog.isPending}
          >
            {createLog.isPending && <Loader2 className="size-4 animate-spin" />}
            Upload Log
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
