
/*
 * SAARAS-X model capabilities
 *
 * TEMPORARY PLACEHOLDER:
 * Replace these values with the actual backend capabilities
 * response before enabling real inference.
 *
 * The example resolutions are illustrative only.
 */


import { apiRequest } from "./client.js";
import { appConfig } from "../../config/appConfig.js";
export const CAPABILITIES_SOURCE = "placeholder";

export const PLACEHOLDER_CAPABILITIES = {
  model_version: null,

  input_resolutions: [10, 20],

  target_resolutions: [5, 4],

  supported_pairs: [
    { input: 10, target: 5 },
    { input: 10, target: 4 },
    { input: 20, target: 5 },
    { input: 20, target: 4 },
  ],

  supported_formats: ["tif", "tiff"],

  resolution_unit: "m / pixel",
};

export function validateResolutionPair(
  inputResolution,
  targetResolution,
  capabilities = PLACEHOLDER_CAPABILITIES
) {
  const input = Number(inputResolution);
  const target = Number(targetResolution);

  if (
    inputResolution === "" ||
    targetResolution === "" ||
    !Number.isFinite(input) ||
    !Number.isFinite(target) ||
    input <= 0 ||
    target <= 0
  ) {
    return {
      valid: false,
      message: "Enter valid positive resolution values.",
    };
  }

  const supportedPair = capabilities.supported_pairs.some(
    (pair) =>
      pair.input === input &&
      pair.target === target
  );

  if (!supportedPair) {
    return {
      valid: false,
      message:
        "This input and target resolution combination is not supported.",
    };
  }

  return {
    valid: true,
    message: "",
  };
}


export async function getCapabilities() {
  return apiRequest(appConfig.endpoints.capabilities);
}