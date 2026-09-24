
const ACCEPTED_EXTENSIONS = [
  ".tif",
  ".tiff",
  ".png",
  ".jpg",
  ".jpeg",
];

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export function validateImage(file) {
  if (!file) {
    return "Please select an image.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "The selected file exceeds the 100 MB limit.";
  }

  const extension = file.name
    .slice(file.name.lastIndexOf("."))
    .toLowerCase();

  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    return "Unsupported file extension.";
  }

  const acceptedMimeTypes = [
    "image/tiff",
    "image/png",
    "image/jpeg",
  ];

  if (
    file.type &&
    !acceptedMimeTypes.includes(file.type)
  ) {
    return "Unsupported image format.";
  }

  return null;
}