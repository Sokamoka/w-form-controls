export const FOCUS_BEHAVIOR = {
  first: 'FirstElement',
  previous: 'PreviousElement',
  next: 'NextElement',
};

// Credit:
//  - https://stackoverflow.com/a/30753870
const focusableSelector = [
  '[contentEditable=true]',
  '[tabindex]',
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'iframe',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
]
  .map((selector) => `${selector}:not([tabindex='-1'])`)
  .join(',');

export function getFocusableElements(container = document.body) {
  if (container === null) return [];
  return Array.from(container.querySelectorAll(focusableSelector));
}

export function isFocusableElement(element) {
  return element?.matches(focusableSelector);
}

export function focusIn(container, focusBehavior, loop = false) {
  const ownerDocument = container[0]?.ownerDocument ?? document;

  const elements = Array.isArray(container) ? container : getFocusableElements(container);

  const { activeElement } = ownerDocument;

  const direction = (() => {
    if (focusBehavior === FOCUS_BEHAVIOR.first) return 0;
    if (focusBehavior === FOCUS_BEHAVIOR.next) return 1;
    if (focusBehavior === FOCUS_BEHAVIOR.previous) return -1;

    throw new Error('Missing FOCUS_BEHAVIOR');
  })();
  const startIndex = Math.max(0, elements.indexOf(activeElement)) + direction;

  const focusOptions = { preventScroll: true };

  const numberOfElements = elements.length;
  let offset = 0;
  let nextElement;

  do {
    // Guard against infinite loops
    if (offset >= numberOfElements || offset + numberOfElements <= 0) return;

    let nextIdx = startIndex + offset;

    if (loop) {
      nextIdx = (nextIdx + numberOfElements) % numberOfElements;
    } else if (nextIdx < 0 || nextIdx >= numberOfElements) return;

    nextElement = elements[nextIdx];
    nextElement.focus(focusOptions);

    // Try the nextElement one in line
    offset += direction;
  } while (nextElement !== ownerDocument.activeElement);
}

export const handleElementFocus = (element) => {
  if (isFocusableElement(element)) return element?.focus(); // Ha pl. button
  focusIn(element, FOCUS_BEHAVIOR.first); // Pl. input komponens
};
