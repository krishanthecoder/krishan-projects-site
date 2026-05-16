import { AddIcon } from "@sanity/icons";
import { Button, Grid } from "@sanity/ui";
import type { ArrayInputFunctionsProps, ArraySchemaType } from "sanity";

/** “Add tag” label instead of Sanity’s default “Add item”. */
export function GalleryCategoriesArrayFunctions(
  props: ArrayInputFunctionsProps<{ _key: string }, ArraySchemaType>,
) {
  const { schemaType, readOnly, onValueCreate, onItemAppend, children } = props;

  const handleAdd = () => {
    const memberType = schemaType.of[0];
    // Sanity’s runtime passes the array member type; the public typedef is narrower.
    const item = onValueCreate(memberType as unknown as ArraySchemaType);
    onItemAppend(item);
  };

  if (schemaType.options?.disableActions?.includes("add")) {
    return null;
  }

  if (readOnly) {
    return (
      <Grid>
        <Button
          icon={AddIcon}
          mode="ghost"
          text="Add tag"
          disabled
          data-testid="add-read-object-button"
        />
      </Grid>
    );
  }

  return (
    <Grid
      gap={1}
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}
    >
      <Button
        icon={AddIcon}
        mode="ghost"
        text="Add tag"
        onClick={handleAdd}
        data-testid="add-single-object-button"
      />
      {children}
    </Grid>
  );
}
