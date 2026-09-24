
import { useCallback, useEffect, useState } from "react";

import {
  PLACEHOLDER_CAPABILITIES,
  validateResolutionPair,
} from "../services/api/capabilities.js";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

const ACCEPTED_EXTENSIONS = [
  ".tif",
  ".tiff",
  ".png",
  ".jpg",
  ".jpeg",
];

const ACCEPTED_MIME_TYPES = [
  "image/tiff",
  "image/png",
  "image/jpeg",
];

export function validateImageFile(file, capabilities) {
  if (!file) {
    return "Please select an image.";
  }

  if (file.size === 0) {
    return "The selected file is empty.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "The file exceeds the 100 MB size limit.";
  }

  const extension = file.name
    .slice(file.name.lastIndexOf("."))
    .toLowerCase();

  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    return "Unsupported file extension.";
  }

  if (
    file.type &&
    !ACCEPTED_MIME_TYPES.includes(file.type)
  ) {
    return "Unsupported image MIME type.";
  }

  const supportedFormats =
    capabilities.supported_formats.map((format) =>
      format.toLowerCase().replace(".", "")
    );

  if (!supportedFormats.includes(extension.slice(1))) {
    return "This image format is not supported by the configured model.";
  }

  return "";
}

export function useAnalysis() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [inputResolution, setInputResolution] =
    useState("10");

  const [targetResolution, setTargetResolution] =
    useState("4");

  const [capabilities] = useState(
    PLACEHOLDER_CAPABILITIES
  );

  const [status, setStatus] = useState("draft");
  const [error, setError] = useState("");

  const resolutionValidation = validateResolutionPair(
    inputResolution,
    targetResolution,
    capabilities
  );

  const fileValidation = file
    ? validateImageFile(file, capabilities)
    : "Please select an image.";

  const isConfigurationValid =
    Boolean(file) &&
    !fileValidation &&
    resolutionValidation.valid;

  const selectFile = useCallback((selectedFile) => {
    if (!selectedFile) return;

    const validationError = validateImageFile(
      selectedFile,
      PLACEHOLDER_CAPABILITIES
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);
    setError("");
    setStatus("draft");
  }, []);

  const replaceFile = useCallback((selectedFile) => {
    selectFile(selectedFile);
  }, [selectFile]);

  const removeFile = useCallback(() => {
    setFile(null);
    setError("");
    setStatus("draft");
  }, []);

  const resetAnalysis = useCallback(() => {
    setFile(null);
    setInputResolution("10");
    setTargetResolution("4");
    setError("");
    setStatus("draft");
  }, []);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const updateInputResolution = useCallback((value) => {
    setInputResolution(value);
    setError("");
  }, []);

  const updateTargetResolution = useCallback((value) => {
    setTargetResolution(value);
    setError("");
  }, []);

  /*
   * Do not submit a real job yet.
   * Connect this action to jobs.js after the backend
   * request and response contract is confirmed.
   */
  const submitAnalysis = useCallback(() => {
    if (!file) {
      setError("Upload an image before continuing.");
      return false;
    }

    const imageError = validateImageFile(file, capabilities);

    if (imageError) {
      setError(imageError);
      return false;
    }

    const resolution = validateResolutionPair(
      inputResolution,
      targetResolution,
      capabilities
    );

    if (!resolution.valid) {
      setError(resolution.message);
      return false;
    }

    setError(
      "Inference is not connected yet. No analysis job was submitted."
    );

    return false;
  }, [
    file,
    capabilities,
    inputResolution,
    targetResolution,
  ]);

  return {
    file,
    preview,

    inputResolution,
    targetResolution,

    capabilities,
    status,
    error,

    isConfigurationValid,

    selectFile,
    replaceFile,
    removeFile,

    updateInputResolution,
    updateTargetResolution,

    submitAnalysis,
    resetAnalysis,

    setStatus,
    setError,
  };
}