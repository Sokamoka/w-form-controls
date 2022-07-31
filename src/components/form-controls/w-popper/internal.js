export const PLACEMENTS = [
  "auto",
  "auto-start",
  "auto-end",
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "right",
  "right-start",
  "right-end",
  "left",
  "left-start",
  "left-end",
];

export const SHOW_EVENT_MAP = {
  hover: "mouseenter",
  focus: "focus",
  click: "click",
  touch: "touchstart",
  focusWithin: "focusin",
};

export const HIDE_EVENT_MAP = {
  hover: "mouseleave",
  focus: "blur",
  click: "click",
  touch: "touchend",
  focusWithin: "focusout",
};

export const useTriggerEvents = (
  eventMap,
  commonTriggers,
  customTrigger,
  handler,
  clickHandler
) => {
  let triggers = commonTriggers;

  if (customTrigger !== null) {
    triggers =
      typeof customTrigger === "function"
        ? customTrigger(triggers)
        : customTrigger;
  }

  const events = {};
  triggers.forEach((trigger) => {
    const eventType = eventMap[trigger];
    if (eventType) {
      events[eventType] = eventType === "click" ? clickHandler : handler;
    }
  });
  return events;
};
