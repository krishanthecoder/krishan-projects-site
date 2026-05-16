import { Fragment, type ComponentType } from "react";
import type { Tool } from "sanity";
import { definePlugin } from "sanity";

import { DefaultHomepageStructureNavigation } from "../components/default-homepage-structure-navigation";

const STRUCTURE_TOOL_NAME = "structure";

type StructureToolComponentProps = {
  tool: Tool;
};

/** Wraps the Structure tool so default-pane navigation runs in the correct router scope. */
export const defaultHomepageStructureNavigationPlugin = definePlugin({
  name: "default-homepage-structure-navigation",
  tools: (prev) =>
    prev.map((tool) => {
      if (tool.name !== STRUCTURE_TOOL_NAME) {
        return tool;
      }

      const OriginalComponent = tool.component as ComponentType<StructureToolComponentProps>;

      return {
        ...tool,
        component: function StructureToolWithDefaultHomepage(props: StructureToolComponentProps) {
          return (
            <Fragment>
              <DefaultHomepageStructureNavigation />
              <OriginalComponent {...props} />
            </Fragment>
          );
        },
      };
    }),
});
