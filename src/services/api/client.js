
import { apiUrl } from "../../config/appConfig.js";

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  if (contentType.includes("text/")) {
    return response.text();
  }

  if (response.ok) {
    return response.blob();
  }

  return null;
}

export async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(apiUrl(path), {
      ...options,

      headers: {
        Accept: "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Unable to connect to the SAARAS-X server. Check that the backend is running and try again."
    );
  }

  let data;

  try {
    data = await parseResponse(response);
  } catch {
    throw new Error(
      "The server returned an unreadable response."
    );
  }

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.detail ||
          data?.message ||
          data?.error;

    throw new Error(
      message || `Request failed with status ${response.status}.`
    );
  }

  return data;
}