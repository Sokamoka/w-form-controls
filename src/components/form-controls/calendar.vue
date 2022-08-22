<template>
  <Calendar tabindex="-1" v-bind="$attrs" v-on="$listeners">
    <template v-slot:header-left-button>
      <button tabindex="-1">
        <ArrowLeftIcon />
      </button>
    </template>
    <template v-slot:header-right-button>
      <button tabindex="-1">
        <ArrowRightIcon />
      </button>
    </template>
  </Calendar>
</template>

<script setup>
import Calendar from 'v-calendar/lib/components/calendar.umd';
import { ArrowRightIcon } from "@vue-hero-icons/outline";
import { ArrowLeftIcon } from "@vue-hero-icons/outline";
</script>
