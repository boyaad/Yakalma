import { useRef, useState } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";

const MAX_SIZE_MB = 5;

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * ImageUploader
 *
 * Props:
 *  value    : string | null  — base64 data-url of the current image
 *  onChange : (dataUrl | null) => void
 *  error    : string
 */
export function ImageUploader({ value, onChange, error }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  async function processFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`L'image ne doit pas dépasser ${MAX_SIZE_MB}MB`);
      return;
    }
    const dataUrl = await readFileAsDataURL(file);
    onChange(dataUrl);
  }

  function handleInputChange(e) {
    processFile(e.target.files?.[0]);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  }

  function handleRemove(e) {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const dropzoneClass = [
    "relative rounded-2xl p-8 text-center cursor-pointer transition-all",
    isDragging
      ? "bg-primary/5 scale-105"
      : value
        ? "bg-green-50"
        : "hover:bg-muted/50",
  ].join(" ");

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <label className="block mb-3 font-semibold">
        Photo du plat <span className="text-red-500">*</span>
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={dropzoneClass}
      >
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="max-h-64 mx-auto rounded-xl object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 text-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Image ajoutée avec succès</span>
            </div>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium mb-2">
              Cliquez pour télécharger ou glissez-déposez
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              JPG, PNG ou WEBP (max. {MAX_SIZE_MB}MB)
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
              <Upload className="w-4 h-4" />
              Parcourir
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <XCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
