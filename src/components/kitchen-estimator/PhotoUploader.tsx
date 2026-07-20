import { useCallback, useRef, useState } from "react";
import { Upload, X, Camera, Image } from "lucide-react";
import {
  validateFile,
  canContinue,
  MIN_PHOTOS,
  MAX_PHOTOS,
} from "../../lib/kitchen-estimator/file-validation";
import { cn } from "@/lib/utils";

interface PhotoUploaderProps {
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
  onAnalyze: () => void;
}

interface PhotoError {
  fileName: string;
  message: string;
}

export function PhotoUploader({ photos, onPhotosChange, onAnalyze }: PhotoUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<PhotoError[]>([]);
  const [previews, setPreviews] = useState<Map<string, string>>(new Map());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMaxReached = photos.length >= MAX_PHOTOS;
  const isAnalyzeEnabled = canContinue(photos);

  const generatePreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const newErrors: PhotoError[] = [];
      const filesToAdd: File[] = [];

      const files = Array.from(fileList);

      for (const file of files) {
        // Check max limit first
        if (photos.length + filesToAdd.length >= MAX_PHOTOS) {
          break;
        }

        const result = validateFile(file);
        if (result.valid) {
          filesToAdd.push(file);
        } else {
          for (const error of result.errors) {
            newErrors.push({ fileName: file.name, message: error.message });
          }
        }
      }

      if (filesToAdd.length > 0) {
        // Generate previews for new files
        const newPreviews = new Map(previews);
        for (const file of filesToAdd) {
          const preview = await generatePreview(file);
          newPreviews.set(file.name + file.lastModified, preview);
        }
        setPreviews(newPreviews);
        onPhotosChange([...photos, ...filesToAdd]);
      }

      setErrors(newErrors);
    },
    [photos, previews, onPhotosChange, generatePreview],
  );

  const handleRemove = useCallback(
    (index: number) => {
      const file = photos[index];
      const key = file.name + file.lastModified;
      const newPreviews = new Map(previews);
      newPreviews.delete(key);
      setPreviews(newPreviews);

      const newPhotos = photos.filter((_, i) => i !== index);
      onPhotosChange(newPhotos);
      setErrors([]);
    },
    [photos, previews, onPhotosChange],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (isMaxReached) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [isMaxReached, handleFiles],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
      // Reset input so same file can be selected again
      e.target.value = "";
    },
    [handleFiles],
  );

  const openFilePicker = useCallback(() => {
    if (!isMaxReached) {
      fileInputRef.current?.click();
    }
  }, [isMaxReached]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold font-display text-primary">Upload Kitchen Photos</h2>
        <p className="text-muted-foreground font-sans">
          Upload {MIN_PHOTOS}–{MAX_PHOTOS} photos of your kitchen for AI analysis. Include different
          angles for the best results.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Drop zone for kitchen photos. Click or drag files here to upload."
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFilePicker();
          }
        }}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isMaxReached
            ? "border-muted bg-muted/30 cursor-not-allowed opacity-60"
            : isDragOver
              ? "border-accent bg-accent/5 scale-[1.01]"
              : "border-primary/40 bg-card hover:border-primary/70 hover:bg-primary/[0.02]",
        )}
      >
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            isDragOver ? "bg-accent/10" : "bg-primary/5",
          )}
        >
          {isDragOver ? (
            <Image className="h-7 w-7 text-accent" />
          ) : (
            <Upload className="h-7 w-7 text-primary" />
          )}
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-primary">
            {isDragOver ? "Drop photos here" : "Drag & drop photos here"}
          </p>
          <p className="text-xs text-muted-foreground">or click to browse files</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Camera className="h-3.5 w-3.5" />
          <span>JPEG, PNG, or WebP • Max 10 MB each</span>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Max photos reached message */}
      {isMaxReached && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground"
        >
          <Image className="h-4 w-4 shrink-0" />
          <span>
            Maximum of {MAX_PHOTOS} photos reached. Remove a photo to add a different one.
          </span>
        </div>
      )}

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="space-y-2" role="alert" aria-live="polite">
          {errors.map((error, index) => (
            <div
              key={`${error.fileName}-${index}`}
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              <X className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <strong className="font-medium">{error.fileName}:</strong> {error.message}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Photo previews */}
      {photos.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-primary">
            {photos.length} of {MAX_PHOTOS} photos uploaded
            {photos.length < MIN_PHOTOS && (
              <span className="text-muted-foreground font-normal">
                {" "}
                — need at least {MIN_PHOTOS} to continue
              </span>
            )}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((file, index) => {
              const key = file.name + file.lastModified;
              const previewUrl = previews.get(key);

              return (
                <div
                  key={key}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted/30"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={`Kitchen photo ${index + 1}: ${file.name}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    aria-label={`Remove photo ${index + 1}: ${file.name}`}
                    className={cn(
                      "absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full",
                      "bg-black/60 text-white hover:bg-destructive transition-colors",
                      "opacity-0 group-hover:opacity-100 focus:opacity-100",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* File name overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
                    <p className="truncate text-[11px] text-white/90">{file.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analyze button */}
      <button
        type="button"
        onClick={onAnalyze}
        disabled={!isAnalyzeEnabled}
        className={cn(
          "w-full rounded-lg px-6 py-3.5 text-base font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isAnalyzeEnabled
            ? "bg-[#028a40] text-white hover:bg-[#028a40]/90 shadow-md hover:shadow-lg cursor-pointer"
            : "bg-muted text-muted-foreground cursor-not-allowed",
        )}
      >
        <span className="flex items-center justify-center gap-2">
          <Camera className="h-5 w-5" />
          Analyze My Kitchen
        </span>
      </button>
    </div>
  );
}
