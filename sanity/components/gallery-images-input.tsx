"use client";

import { UploadIcon } from "@sanity/icons";
import { Button, Card, Flex, Stack, Text, useToast } from "@sanity/ui";
import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import type { ArrayOfObjectsInputProps, ImageValue } from "sanity";
import { useClient } from "sanity";

import { sanityApiVersion } from "../env";

function imageKey() {
  return `img-${Math.random().toString(36).slice(2, 10)}`;
}

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

/**
 * Keeps the default gallery array UI and adds a multi-file upload control
 * so editors can select many photos at once instead of one-by-one.
 */
export function GalleryImagesInput(props: ArrayOfObjectsInputProps) {
  const { onItemAppend, readOnly, renderDefault } = props;
  const client = useClient({ apiVersion: sanityApiVersion });
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null,
  );
  const [dragging, setDragging] = useState(false);

  const uploadFiles = useCallback(
    async (fileList: FileList | File[]) => {
      if (readOnly || uploading) return;

      const files = Array.from(fileList).filter(isImageFile);
      if (files.length === 0) {
        toast.push({
          status: "warning",
          title: "No images selected",
          description: "Choose JPG, PNG, or WebP files to upload.",
        });
        return;
      }

      setUploading(true);
      setProgress({ done: 0, total: files.length });

      let succeeded = 0;
      let failed = 0;

      for (const [index, file] of files.entries()) {
        try {
          const asset = await client.assets.upload("image", file, {
            filename: file.name,
          });
          onItemAppend({
            _type: "image",
            _key: imageKey(),
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
          } as ImageValue & { _key: string });
          succeeded += 1;
        } catch (error) {
          failed += 1;
          console.error(`Failed to upload ${file.name}`, error);
        }
        setProgress({ done: index + 1, total: files.length });
      }

      setUploading(false);
      setProgress(null);

      if (succeeded > 0) {
        toast.push({
          status: failed > 0 ? "warning" : "success",
          title:
            succeeded === 1
              ? "1 image uploaded"
              : `${succeeded} images uploaded`,
          description:
            failed > 0
              ? `${failed} file${failed === 1 ? "" : "s"} failed. Add alt text to each new image before publishing.`
              : "Add alt text to each new image before publishing.",
        });
      } else {
        toast.push({
          status: "error",
          title: "Upload failed",
          description: "Could not upload the selected images. Try again.",
        });
      }
    },
    [client, onItemAppend, readOnly, toast, uploading],
  );

  const onFileInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files?.length) {
        void uploadFiles(files);
      }
      event.target.value = "";
    },
    [uploadFiles],
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragging(false);
      if (event.dataTransfer.files?.length) {
        void uploadFiles(event.dataTransfer.files);
      }
    },
    [uploadFiles],
  );

  return (
    <Stack space={3}>
      <Card
        padding={3}
        radius={2}
        border
        tone={dragging ? "primary" : "transparent"}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={onDrop}
      >
        <Stack space={3}>
          <Text size={1} muted>
            Upload many photos at once — click the button or drop files here.
            You can still reorder items below and add alt text on each image.
          </Text>
          <Flex align="center" gap={3} wrap="wrap">
            <Button
              icon={UploadIcon}
              text={uploading ? "Uploading…" : "Upload multiple images"}
              tone="primary"
              mode="ghost"
              disabled={Boolean(readOnly) || uploading}
              onClick={() => inputRef.current?.click()}
            />
            {progress ? (
              <Text size={1} muted>
                {progress.done} of {progress.total} uploaded…
              </Text>
            ) : null}
          </Flex>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={Boolean(readOnly) || uploading}
            onChange={onFileInputChange}
          />
        </Stack>
      </Card>

      {renderDefault(props)}
    </Stack>
  );
}
