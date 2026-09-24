
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

export const appConfig = {
  apiBaseUrl: API_BASE_URL,

  apiPrefix: "/api/v1",

  endpoints: {
    capabilities: "/capabilities",
    jobs: "/jobs",
  },

  upload: {
    maxSizeBytes: 100 * 1024 * 1024,

    acceptedExtensions: [
      ".tif",
      ".tiff",
      ".png",
      ".jpg",
      ".jpeg",
    ],

    acceptedMimeTypes: [
      "image/tiff",
      "image/png",
      "image/jpeg",
    ],
  },

  theme: {
    defaultMode: "system",
  },
};

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${appConfig.apiBaseUrl}${appConfig.apiPrefix}${normalizedPath}`;
}