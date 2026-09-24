
import { apiRequest } from "./client.js";
import { appConfig } from "../../config/appConfig.js";

/*
 * Proposed SAARAS-X API contract.
 *
 * Confirm the endpoint paths and request field names
 * against the actual backend before using real inference.
 */

export function createJob({
  image,
  inputResolution,
  targetResolution,
}) {
  if (!image) {
    throw new Error("An image is required to create a job.");
  }

  const formData = new FormData();

  formData.append("image", image);

  formData.append(
    "input_resolution",
    String(inputResolution)
  );

  formData.append(
    "target_resolution",
    String(targetResolution)
  );

  return apiRequest(appConfig.endpoints.jobs, {
    method: "POST",
    body: formData,
  });
}

export function getJob(jobId) {
  if (!jobId) {
    throw new Error("A job ID is required.");
  }

  return apiRequest(
    `${appConfig.endpoints.jobs}/${encodeURIComponent(jobId)}`
  );
}

export function getJobResult(jobId) {
  if (!jobId) {
    throw new Error("A job ID is required.");
  }

  return apiRequest(
    `${appConfig.endpoints.jobs}/${encodeURIComponent(jobId)}/result`
  );
}