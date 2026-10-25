<!-- frontend/app/components/home/views/HomeDesktop.vue -->
<template>
  <div :class="appConfig.layout.homeWrapper">
    <!-- HERO SECTION -->
    <section id="home" :class="appConfig.layout.homeHeroSection">
      <UButton :label="UI_TEXT.home.getStarted" to="/groups" variant="actionHeroButton" />
      <p :class="appConfig.typography.homeHeroText">{{ UI_TEXT.home.description }}</p>
    </section>

    <!-- FEATURE CARDS SECTION -->
    <section :class="appConfig.layout.homeCardsSection">
      <UCard
        v-for="card in featureCards"
        :key="card.id"
        :variant="activeCard === card.id ? 'outlineGlass' : 'interactiveGlass'"
        class="overflow-hidden"
        :class="[
          activeCard === card.id
            ? 'w-full order-1'
            : activeCard
              ? 'w-full md:flex-1 md:w-auto order-2'
              : 'w-full md:flex-1 order-0',
        ]"
      >
        <div
          :class="
            activeCard === card.id
              ? `flex flex-col md:flex-row items-center w-full ${SPACING_TOKENS.gap.lg} h-full`
              : 'flex flex-col items-center flex-1 text-center w-full h-full'
          "
        >
          <div
            :class="
              activeCard === card.id
                ? 'flex flex-col items-start justify-center md:w-1/3 text-left'
                : 'flex flex-col items-center w-full justify-between h-full'
            "
          >
            <!-- Card Header & Content Wrapper -->
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

            <!-- Card Bottom Action -->
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
          </div>

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
    <section id="support" :class="appConfig.layout.homeContentSection">
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
import { useAppConfig } from '#imports';

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

const appConfig = useAppConfig();

defineProps<{
  featureCards: FeatureCard[];
  contactLinks: ContactLink[];
  activeCard: string | null;
}>();

const emit = defineEmits<{
  (e: 'toggleCard', id: string): void;
}>();
</script>
