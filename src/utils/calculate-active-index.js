export const Focus = {
  /** Focus the first non-disabled item. */
  FIRST: 'First',

  /** Focus the previous non-disabled item. */
  PREVIOUS: 'Previous',

  /** Focus the next non-disabled item. */
  NEXT: 'Next',

  /** Focus the last non-disabled item. */
  LAST: 'Last',

  /** Focus a specific item based on the `id` of the item. */
  SPECIFIC: 'Specific',

  /** Focus no items at all. */
  NOTHING: 'Nothing',
};

export function calculateActiveIndex(action, resolvers) {
  const items = resolvers.resolveItems();
  if (items.length <= 0) return null;

  const currentActiveIndex = resolvers.resolveActiveIndex();
  const activeIndex = currentActiveIndex ?? -1;

  const nextActiveIndex = (() => {
    switch (action.focus) {
      case Focus.FIRST:
        return items.findIndex((item) => !resolvers.resolveDisabled(item));

      case Focus.PREVIOUS: {
        const idx = items
          .slice()
          .reverse()
          .findIndex((item, idx, all) => {
            if (activeIndex !== -1 && all.length - idx - 1 >= activeIndex) return false;
            return !resolvers.resolveDisabled(item);
          });
        if (idx === -1) return idx;
        return items.length - 1 - idx;
      }

      case Focus.NEXT:
        return items.findIndex((item, idx) => {
          if (idx <= activeIndex) return false;
          return !resolvers.resolveDisabled(item);
        });

      case Focus.LAST: {
        const idx = items
          .slice()
          .reverse()
          .findIndex((item) => !resolvers.resolveDisabled(item));
        if (idx === -1) return idx;
        return items.length - 1 - idx;
      }

      case Focus.SPECIFIC:
        return items.findIndex((item) => resolvers.resolveId(item) === action.id);

      case Focus.NOTHING:
        return null;

      default:
        return null;
    }
  })();

  return nextActiveIndex === -1 ? currentActiveIndex : nextActiveIndex;
}
