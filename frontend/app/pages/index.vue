<!-- frontend/app/pages/index.vue -->
<template>
  <div>
    <ClientOnly>
      <template #fallback>
        <div class="min-h-screen flex items-center justify-center">
          <span class="opacity-50 font-medium">{{ UI_TEXT.common.loading }}</span>
        </div>
      </template>

      <HomeMobile
        v-if="isMobile"
        :feature-cards="featureCards"
        :contact-links="contactLinks"
        :active-card="activeCard"
        @toggle-card="toggleCard"
      />
      <HomeDesktop
        v-else
        :feature-cards="featureCards"
        :contact-links="contactLinks"
        :active-card="activeCard"
        @toggle-card="toggleCard"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { ref } from 'vue';
import { definePageMeta } from '#imports';
import { useScreenSize } from '~/composables/useScreenSize';

/* --- PAGE CONFIGURATION --- */
definePageMeta({
  layout: 'default',
  middleware: ['guest'],
});

/* --- COMPOSABLES & STATE --- */
const { isMobile } = useScreenSize();
const activeCard = ref<string | null>(null);

/* --- EVENT HANDLERS --- */
const toggleCard = (id: string) => {
  activeCard.value = activeCard.value === id ? null : id;
};

/* --- MOCK DATA / CONSTANTS --- */
const featureCards = [
  {
    id: 'docs',
    title: UI_TEXT.home.documentManagementTitle,
    icon: 'i-heroicons-document-text',
    desc: UI_TEXT.home.documentManagementDescription,
    extendedDesc: UI_TEXT.home.documentManagementExtended,
  },
  {
    id: 'calendar',
    title: UI_TEXT.home.eventCalendarTitle,
    icon: 'i-heroicons-calendar-days',
    desc: UI_TEXT.home.eventCalendarDescription,
    extendedDesc: UI_TEXT.home.eventCalendarExtended,
  },
  {
    id: 'gallery',
    title: UI_TEXT.home.groupGalleryTitle,
    icon: 'i-heroicons-photo',
    desc: UI_TEXT.home.groupGalleryDescription,
    extendedDesc: UI_TEXT.home.groupGalleryExtended,
  },
];

const contactLinks = [
  {
    name: UI_TEXT.home.discord,
    icon: 'i-mdi-discord',
    url: 'https://discord.com',
    target: '_blank',
  },
  {
    name: UI_TEXT.home.instagram,
    icon: 'i-mdi-instagram',
    url: 'https://instagram.com',
    target: '_blank',
  },
  {
    name: UI_TEXT.home.facebook,
    icon: 'i-mdi-facebook',
    url: 'https://facebook.com',
    target: '_blank',
  },
  {
    name: UI_TEXT.auth.emailLabel,
    icon: 'i-mdi-envelope',
    url: 'mailto:support@roamly.com',
    target: '_self',
  },
  { name: UI_TEXT.fallback.phone, icon: 'i-mdi-phone', url: 'tel:+1234567890', target: '_self' },
];
</script>
