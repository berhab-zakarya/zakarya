import { supabase } from "./supabase.js";

export const TABLE = "testimonials";
export const AVATAR_BUCKET = "avatars";
export const LIMITS = { name: 60, role: 60, quoteMin: 20, quoteMax: 600, fileBytes: 5 * 1024 * 1024 };
export const ROLES = ["Client", "Coworker", "Manager", "Someone else"];

const COLORS = ["#c8321a", "#7a4f6b", "#4f6b57", "#3f5d7a", "#8a6d2f", "#6b665c"];

export function avatarColor(name) {
  let hash = 0;
  for (const char of name.trim()) hash = (hash * 31 + char.codePointAt(0)) % 9973;
  return COLORS[hash % COLORS.length];
}

export function initialOf(name) {
  return name.trim().charAt(0).toUpperCase();
}

/** Arabic, Persian, Hebrew, Urdu ranges. Falls back to LTR for everything else. */
export function detectDirection(text) {
  return /[֐-ࣿ]/.test(text) ? "rtl" : "ltr";
}

export function isConfigured() {
  return supabase !== null;
}

export async function fetchTestimonials() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("id,name,role,quote,avatar_url,direction,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) throw error;
  return data ?? [];
}

/** Square 320px WebP. Keeps uploads small and strips EXIF metadata. */
async function avatarBlob(file) {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > LIMITS.fileBytes) throw new Error("The photo must be 5 MB or smaller.");

  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 320, 320);
  bitmap.close?.();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
  if (!blob) throw new Error("Could not process that image. Try a JPG or PNG.");
  return blob;
}

export async function submitTestimonial({ name, role, quote, direction, file }) {
  if (!supabase) throw new Error("Testimonials are not connected yet.");

  let uploadedPath = null;
  let avatarUrl = null;

  if (file) {
    const blob = await avatarBlob(file);
    const id = globalThis.crypto?.randomUUID?.() ?? String(Date.now());
    uploadedPath = `testimonials/${id}.webp`;
    const upload = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(uploadedPath, blob, { contentType: "image/webp", cacheControl: "31536000", upsert: false });
    if (upload.error) throw upload.error;
    avatarUrl = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(uploadedPath).data.publicUrl;
  }

  const { error } = await supabase.from(TABLE).insert({
    name: name.trim(),
    role: role.trim() || null,
    quote: quote.trim(),
    direction,
    avatar_url: avatarUrl,
    published: false,
  });

  if (error) {
    if (uploadedPath) await supabase.storage.from(AVATAR_BUCKET).remove([uploadedPath]);
    throw error;
  }
}
