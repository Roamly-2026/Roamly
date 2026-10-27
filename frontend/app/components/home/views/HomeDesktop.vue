<!-- frontend/app/components/home/views/HomeDesktop.vue -->
<template>
  <div :class="appConfig.layout.homeWrapper">
    <!-- HERO SECTION -->
    <section id="home" :class="appConfig.layout.homeHeroSection">
      <BaseButton :label="UI_TEXT.home.getStarted" to="/groups" variant="actionHeroButton" />
      <p :class="appConfig.typography.homeHeroText">{{ UI_TEXT.home.description }}</p>
    </section>

    <!-- FEATURE CARDS SECTION -->
    <section :class="appConfig.layout.homeCardsSection">
      <BaseCard
        v-for="card in featureCards"
        :key="card.id"
        :variant="activeCard === card.id ? 'outlineGlass' : 'interactiveGlass'"
        :class="activeCard === card.id ? 'w-full order-1' : 'flex-1 order-2'"
      >
        <div :class="appConfig.layout.cardContent">
          <div :class="appConfig.layout.cardContentCenter">
            <!-- Card Header & Content Wrapper -->
            <div :class="appConfig.layout.cardContentCenter">
              <h3
                :class="[
                  appConfig.typography.cardTitleCenter,
                  activeCard === card.id ? COLOR_TOKENS.text.inverse : COLOR_TOKENS.text.primary,
                ]"
              >
                {{ card.title }}
              </h3>
              <UIcon
                :name="card.icon"
                :class="[
                  ,
                  SIZE_TOKENS.avatar.lg,
                  OPACITY_TOKENS.soft,
                  INTERACTION_TOKENS.base,
                  activeCard === card.id
                    ? COLOR_TOKENS.text.inverse
                    : COLOR_TOKENS.text.brandAccent,
                ]"
              />
              <p
                :class="[
                  TEXT_SIZES.sm,
                  TEXT_LEADING.relaxed,
                  SPACING_TOKENS.mb.sm,
                  activeCard === card.id
                    ? COLOR_TOKENS.text.inverse
                    : COLOR_TOKENS.text.primarySoft,
                ]"
              >
                {{ card.desc }}
              </p>
            </div>
            <!-- Card Bottom Action -->
            <BaseButton
              variant="ghost"
              :class="[
                appConfig.typography.navLink,
                FONT_WEIGHTS.bold,
                TEXT_TRACKING.wide,
                SPACING_TOKENS.mt.sm,
                INTERACTION_TOKENS.base,
                activeCard === card.id ? COLOR_TOKENS.text.inverse : COLOR_TOKENS.text.brandAccent,
              ]"
              @click="emit('toggleCard', card.id)"
            >
              {{ activeCard === card.id ? UI_TEXT.home.showLess : UI_TEXT.home.learnMore }}
            </BaseButton>
          </div>

          <!-- Extended Description (Active State) -->
          <div
            v-if="activeCard === card.id"
            :class="[
              appConfig.layout.divider,
              SPACING_TOKENS.pt.md,
              COLOR_TOKENS.text.inverse,
              OPACITY_TOKENS.high,
              TEXT_LEADING.relaxed,
            ]"
          >
            <ul :class="[appConfig.layout.formWrapper, SPACING_TOKENS.pl.lg]">
              <li v-for="(item, index) in card.extendedDesc" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </BaseCard>
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
      <div :class="[appConfig.layout.actionGroup, SPACING_TOKENS.mt.md]">
        <BaseButton
          v-for="link in contactLinks"
          :key="link.name"
          :icon="link.icon"
          :to="link.url"
          :target="link.target"
          variant="glassIconButtonBrand"
          size="xl"
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
