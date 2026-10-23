import { useState, type ChangeEvent } from "react";
import { Camera, ImagePlus, X } from "lucide-react";

type Photo = { id: string; name: string; url: string };

export default function InspectionPhotos({ readOnly = false }: { readOnly?: boolean }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [preview, setPreview] = useState<Photo | null>(null);

  const addPhotos = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newPhotos = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
      }));
    setPhotos([...photos, ...newPhotos]);
    e.target.value = ""; // lets you choose the same file again
  };

  const removePhoto = (photo: Photo) => {
    URL.revokeObjectURL(photo.url); // frees the memory used by the preview
    setPhotos(photos.filter((p) => p.id !== photo.id));
  };

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
        <Camera size={18} className="text-blue-700" />
        Inspection Photos
        <span className="text-sm font-normal text-slate-500">({photos.length})</span>
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {photos.map((photo) => (
          <figure
            key={photo.id}
            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
          >
            <button
              type="button"
              onClick={() => setPreview(photo)}
              aria-label={`Open ${photo.name}`}
              className="h-full w-full"
            >
              <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
            </button>
            {!readOnly && (
              <button
                type="button"
                onClick={() => removePhoto(photo)}
                aria-label={`Remove ${photo.name}`}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-slate-600 shadow hover:text-red-600"
              >
                <X size={14} />
              </button>
            )}
          </figure>
        ))}

        {!readOnly && (
          <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 text-slate-400 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600">
            <ImagePlus size={28} />
            <span className="text-sm font-medium">Upload Photos</span>
            <input type="file" accept="image/*" multiple onChange={addPhotos} className="sr-only" />
          </label>
        )}
      </div>

      {readOnly && photos.length === 0 && (
        <p className="text-sm text-slate-400">No inspection photos.</p>
      )}

      {/* Full-size preview */}
      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={preview.name}
          onClick={() => setPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
        >
          <img src={preview.url} alt={preview.name} className="max-h-full max-w-full rounded-xl" />
          <button
            type="button"
            onClick={() => setPreview(null)}
            aria-label="Close preview"
            className="absolute right-6 top-6 rounded-full bg-white p-2 text-slate-700"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
