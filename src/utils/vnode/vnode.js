import { h } from "vue";
import { concat, isEmpty, mergeDeepWith, pick } from "ramda";

const DATA_KEYS = [
  "class",
  "staticClass",
  "style",
  "staticStyle",
  "attrs",
  "props",
  "domProps",
  "on",
  "nativeOn",
  "directives",
  "scopedSlots",
  "slot",
  "ref",
  "key",
];

export const cloneVNode = (vnode, data) => {
  if (!vnode.tag) return vnode.text;

  const isComponent = !isEmpty(vnode.componentOptions ?? {});
  const tag = vnode.componentOptions?.Ctor ?? vnode.tag;
  const vNodeData = isComponent
    ? extractData(vnode, data)
    : mergeDeepWith(concat, vnode.data, data);
  const children = vnode.componentOptions?.children ?? vnode.children;

  return h(tag, vNodeData, children);
};

const extractData = (vnode, customData) => {
  const data = pick(DATA_KEYS, vnode.data);
  const { propsData, listeners } = vnode.componentOptions;
  const { on, attrs, ...restCostumData } = customData;

  return {
    ...data,
    ...restCostumData,
    attrs: { ...data.attrs, ...attrs },
    props: propsData,
    on: { ...listeners, ...on },
    nativeOn: { ...listeners, ...on },
  };
};
