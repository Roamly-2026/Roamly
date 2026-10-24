<!-- frontend/app/components/home/views/HomeMobile.vue -->
<template>
  <div
    :class="`mobile-wrapper ${SPACING_TOKENS.px.md} ${SPACING_TOKENS.py.xl} flex flex-col ${SPACING_TOKENS.gap.xl} overflow-x-hidden`"
  >
    <!-- HERO SECTION -->
    <section id="home" :class="[appConfig.layout.homeHeroSection, SPACING_TOKENS.mt.md]">
      <UButton
        :label="UI_TEXT.home.getStarted"
        to="/groups"
        variant="actionHeroButton"
        :class="SPACING_TOKENS.mb.xl"
      />
      <p :class="appConfig.typography.homeHeroText">
        {{ UI_TEXT.home.description }}
      </p>
    </section>

    <!-- FEATURE CARDS SECTION -->
    <section :class="`flex flex-col ${SPACING_TOKENS.mobile.gridGap} w-full`">
      <UCard
        v-for="card in featureCards"
        :key="card.id"
        :variant="activeCard === card.id ? 'outlineGlass' : 'interactiveGlass'"
        class="overflow-hidden transition-all duration-500 w-full"
      >
        <div :class="`flex flex-col items-center text-center w-full h-full ${SPACING_TOKENS.p.sm}`">
          <!-- Card Content Wrapper -->
          <div :class="`flex flex-col items-center ${SPACING_TOKENS.gap.sm} w-full`">
            <h3
              class="text-lg font-bold tracking-wide transition-colors duration-500"
              :class="activeCard === card.id ? 'text-white' : 'text-dark-text'"
            >
              {{ card.title }}
            </h3>

            <UIcon
              :name="card.icon"
              class="w-14 h-14 opacity-80 transition-colors duration-500"
              :class="activeCard === card.id ? 'text-white' : 'text-brand-500'"
            />

            <p
              :class="[
                `text-sm leading-relaxed transition-colors duration-500 ${SPACING_TOKENS.mb.sm}`,
                activeCard === card.id ? 'text-white/90' : 'text-dark-text/80 text-center',
              ]"
            >
              {{ card.desc }}
            </p>
          </div>

          <!-- Bottom Action Button -->
          <UButton
            variant="ghost"
            :class="[
              `font-bold tracking-wide hover:underline underline-offset-4 transition-colors duration-500 cursor-pointer ${SPACING_TOKENS.mt.sm}`,
              activeCard === card.id ? 'text-white hover:text-white/80' : 'text-brand-500',
            ]"
            @click="emit('toggleCard', card.id)"
          >
            {{ activeCard === card.id ? UI_TEXT.home.showLess : UI_TEXT.home.learnMore }}
          </UButton>

          <!-- Extended Description (Active State) -->
          <div
            v-if="activeCard === card.id"
            :class="`w-full ${SPACING_TOKENS.mt.md} ${SPACING_TOKENS.pt.md} border-t border-white/20 text-white/90 leading-relaxed text-left animate-fade-in`"
          >
            <ul :class="`list-disc pl-5 flex flex-col ${SPACING_TOKENS.gap.sm}`">
              <li v-for="(item, index) in card.extendedDesc" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </UCard>
    </section>

    <!-- ABOUT SECTION -->
    <section id="about" :class="appConfig.layout.homeContentSection">
      <h2 :class="appConfig.typography.homeSectionTitle">{{ UI_TEXT.home.aboutHeading }}</h2>
      <p :class="appConfig.typography.homeSectionText">{{ UI_TEXT.home.aboutDescription }}</p>
    </section>

    <!-- SUPPORT SECTION -->
    <section id="support" :class="[appConfig.layout.homeContentSection, SPACING_TOKENS.mb.xl]">
      <h2 :class="appConfig.typography.homeSectionTitle">{{ UI_TEXT.home.supportHeading }}</h2>
      <p :class="appConfig.typography.homeSectionText">{{ UI_TEXT.home.supportDescription }}</p>
    </section>

    <!-- CONTACT SECTION -->
    <section id="contact" :class="[appConfig.layout.homeContentSection, SPACING_TOKENS.mb.xl]">
      <h2 :class="appConfig.typography.homeSectionTitle">{{ UI_TEXT.home.contactUs }}</h2>
      <div
        :class="`flex ${SPACING_TOKENS.gap.md} ${SPACING_TOKENS.mt.md} items-center justify-center flex-wrap`"
      >
        <UButton
          v-for="link in contactLinks"
          :key="link.name"
          :icon="link.icon"
          :to="link.url"
          :target="link.target"
          variant="glassIconButton"
          size="xl"
          class="justify-center hover:text-brand-500 transition-colors"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { useAppConfig } from '#imports';

/* --- INTERFACES --- */
interface FeatureCard {
  id: string;
  title: string;
  icon: string;
  desc: string;
  extendedDesc: string[];
}

interface ContactLink {
  name: string;
  icon: string;
  url: string;
  target: string;
}

/* --- COMPOSABLES --- */
const appConfig = useAppConfig();

/* --- PROPS & EMITS --- */
defineProps<{
  featureCards: FeatureCard[];
  contactLinks: ContactLink[];
  activeCard: string | null;
}>();

const emit = defineEmits<{
  (e: 'toggleCard', id: string): void;
}>();
</script>
