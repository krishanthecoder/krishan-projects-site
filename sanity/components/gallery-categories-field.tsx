"use client";

import { TagsIcon } from "@sanity/icons";
import { Box, Card, Flex, Heading, Stack, Text } from "@sanity/ui";
import type { ArrayFieldProps } from "sanity";

import { GalleryCategoriesInput } from "./gallery-categories-input";

/** Prominent project field shell for gallery filter tags. */
export function GalleryCategoriesField(props: ArrayFieldProps) {
  const { description, inputProps, title, validation } = props;
  const validationMessages = validation
    .filter((item) => item.level === "error")
    .map((item) => item.message);

  return (
    <Card
      className="kp-gallery-categories-prominent"
      padding={4}
      radius={3}
      shadow={2}
      tone="transparent"
      border
    >
      <Stack space={4}>
        <Flex align="flex-start" gap={3}>
          <Box className="kp-gallery-categories-prominent__icon" padding={3}>
            <Text size={3}>
              <TagsIcon />
            </Text>
          </Box>
          <Stack space={3} flex={1}>
            <Stack space={2}>
              <Heading as="h3" size={2}>
                {title}
              </Heading>
              {description ? (
                <Text size={2} muted>
                  {description}
                </Text>
              ) : null}
            </Stack>
            <Text size={1} className="kp-gallery-categories-prominent__hint">
              Visitors use these tags on the Recent Projects gallery to find this job. Add at
              least one tag before publishing.
            </Text>
          </Stack>
        </Flex>

        <GalleryCategoriesInput {...inputProps} />

        {validationMessages.length > 0 ? (
          <Stack space={2}>
            {validationMessages.map((message) => (
              <Text key={message} size={1} style={{ color: "var(--card-badge-critical-fg-color)" }}>
                {message}
              </Text>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Card>
  );
}
