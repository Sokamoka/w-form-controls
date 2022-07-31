<template>
  <div class="w-popper__arrow" data-popper-arrow>
    <div class="w-popper__arrow--outer"></div>
    <div class="w-popper__arrow--inner"></div>
  </div>
</template>

<style>
.w-popper__arrow {
  width: 10px;
  height: 10px;
}

.w-popper__arrow--outer,
.w-popper__arrow--inner {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
}

.w-popper__arrow--inner {
  border-width: 6px;
}
.w-popper__arrow--outer {
  border-width: 7px;
}

.w-popper__popper[data-popper-placement^='top'] .w-popper__arrow--inner,
.w-popper__popper[data-popper-placement^='bottom'] .w-popper__arrow--inner {
  left: 1px;
}

.w-popper__popper[data-popper-placement^='top'] .w-popper__arrow--outer,
.w-popper__popper[data-popper-placement^='bottom'] .w-popper__arrow--outer {
  top: 0;
}

.w-popper__popper[data-popper-placement^='top'] .w-popper__arrow--inner,
.w-popper__popper[data-popper-placement^='top'] .w-popper__arrow--outer {
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-bottom-width: 0;
}

.w-popper__popper[data-popper-placement^='top'] .w-popper__arrow--inner {
  top: -1px;
}

.w-popper__popper[data-popper-placement^='top'] .w-popper__arrow {
  bottom: -10px;
}

.w-popper__popper[data-popper-placement^='bottom'] .w-popper__arrow {
  top: 0;
}

.w-popper__popper[data-popper-placement^='bottom'] .w-popper__arrow--inner,
.w-popper__popper[data-popper-placement^='bottom'] .w-popper__arrow--outer {
  border-top-color: transparent;
  border-right-color: transparent;
  border-left-color: transparent;
  border-top-width: 0;
}

.w-popper__popper[data-popper-placement^='bottom'] .w-popper__arrow--inner {
  top: -4px;
}

.w-popper__popper[data-popper-placement^='bottom'] .w-popper__arrow--outer {
  top: -6px;
}

.w-popper__popper[data-popper-placement^='left'] .w-popper__arrow--inner,
.w-popper__popper[data-popper-placement^='right'] .w-popper__arrow--inner {
  top: 0;
}

.w-popper__popper[data-popper-placement^='left'] .w-popper__arrow--outer,
.w-popper__popper[data-popper-placement^='right'] .w-popper__arrow--outer {
  top: -1px;
}

.w-popper__popper[data-popper-placement^='right'] .w-popper__arrow--inner,
.w-popper__popper[data-popper-placement^='right'] .w-popper__arrow--outer {
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-left-width: 0;
}

.w-popper__popper[data-popper-placement^='right'] .w-popper__arrow--inner {
  left: -5px;
}

.w-popper__popper[data-popper-placement^='right'] .w-popper__arrow--outer {
  left: -7px;
}

.w-popper__popper[data-popper-placement^='left'] .w-popper__arrow {
  right: -10px;
}

.w-popper__popper[data-popper-placement^='right'] .w-popper__arrow {
  left: 0;
}

.w-popper__popper[data-popper-placement^='left'] .w-popper__arrow--inner,
.w-popper__popper[data-popper-placement^='left'] .w-popper__arrow--outer {
  border-top-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-right-width: 0;
}

.w-popper__popper[data-popper-placement^='left'] .w-popper__arrow--inner {
  left: -1px;
}

.w-popper__popper[data-popper-placement^='left'] .w-popper__arrow--outer {
  left: 0;
}
</style>
