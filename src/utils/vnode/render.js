import { concat, mergeDeepWith } from "ramda";
import { h } from "vue";
import { cloneVNode } from "./vnode";

export const render = ({ visible = true, strategy = "none", ...main }) => {
  if (visible) return _render(main);
  if (strategy === "static") return _render(main); // The user controls visibility, such as during a transition
  if (strategy === "unmount") return null; // Equivalent v-if
  if (strategy === "hidden") {
    // Equivalent v-show

    return _render({
      ...main,
      data: mergeDeepWith(concat, main.data, {
        attrs: { hidden: true },
        style: { display: "none" },
      }),
    });
  }
  return _render(main);
};

const _render = ({ data = {}, slots, slot, name }) => {
  const { as, ...dataObject } = data;
  const children = slots.default?.(slot);

  if (as === "template") {
    if (Object.keys(dataObject).length > 0) {
      const [firstChild, ...other] = children ?? [];

      if (!isValidElement(firstChild) || other.length > 0) {
        throw new Error(
          [
            'Passing props on "template"!',
            "",
            `The current component <${name} /> is rendering a "template".`,
            `However we need to passthrough the following props:`,
            Object.keys(dataObject)
              .concat(Object.keys(data.attrs))
              .map((line) => `  - ${line}`)
              .join("\n"),
            "",
            "You can apply a few solutions:",
            [
              'Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".',
              "Render a single element as the child so that we can forward the props onto that element.",
            ]
              .map((line) => `  - ${line}`)
              .join("\n"),
          ].join("\n")
        );
      }
      return cloneVNode(firstChild, dataObject);
    }

    // if (children?.length === 1) {
    //   return children[0];
    // }

    return children;
  }

  return h(as, dataObject, children);
};

const isValidElement = (element) => {
  if (element === null) return false; // No children
  if (element.tag) return true; // 'div', 'span', ...
  if (element.text) return true; // text
  if (element.componentOptions) return true; // Other components
  return false; // Comments, strings, ...
};
