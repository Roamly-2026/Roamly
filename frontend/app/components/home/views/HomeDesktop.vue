<!-- frontend/app/components/home/views/HomeDesktop.vue -->
<template>
  <div :class="LAYOUT_CONFIG.homeWrapper">
    <!-- HERO SECTION -->
    <section id="home" :class="LAYOUT_CONFIG.homeHeroSection">
      <BaseButton :label="UI_TEXT.home.getStarted" to="/groups" variant="actionHeroButton" />
      <p :class="TYPOGRAPHY_CONFIG.homeHeroText">{{ UI_TEXT.home.description }}</p>
    </section>

    <!-- FEATURE CARDS SECTION -->
    <section :class="LAYOUT_CONFIG.homeCardsSection">
      <BaseCard
        v-for="card in featureCards"
        :key="card.id"
        :variant="activeCard === card.id ? 'outlineGlass' : 'interactiveGlass'"
        :class="
          activeCard === card.id ? LAYOUT_CONFIG.homeCardActive : LAYOUT_CONFIG.homeCardInactive
        "
      >
        <div :class="LAYOUT_CONFIG.cardContentCenter">
          <div :class="LAYOUT_CONFIG.cardContentCenter">
            <h3
              :class="
                activeCard === card.id
                  ? TYPOGRAPHY_CONFIG.cardTitleInverseCenter
                  : TYPOGRAPHY_CONFIG.cardTitleCenter
              "
            >
              {{ card.title }}
            </h3>
            <UIcon
              :name="card.icon"
              :class="
                activeCard === card.id
                  ? TYPOGRAPHY_CONFIG.homeCardIconActive
                  : TYPOGRAPHY_CONFIG.homeCardIconInactive
              "
            />
            <p
              :class="
                activeCard === card.id
                  ? TYPOGRAPHY_CONFIG.homeCardDescActive
                  : TYPOGRAPHY_CONFIG.homeCardDescInactive
              "
            >
              {{ card.desc }}
            </p>
          </div>
          <!-- Card Bottom Action -->
          <BaseButton
            variant="ghost"
            :class="TYPOGRAPHY_CONFIG.authResendBtn"
            @click="emit('toggleCard', card.id)"
          >
            {{ activeCard === card.id ? UI_TEXT.home.showLess : UI_TEXT.home.learnMore }}
          </BaseButton>

          <!-- Extended Description (Active State) -->
          <div v-if="activeCard === card.id" :class="TYPOGRAPHY_CONFIG.homeCardExtendedBox">
            <ul :class="LAYOUT_CONFIG.formWrapper">
              <li v-for="(item, index) in card.extendedDesc" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </BaseCard>
    </section>

    <!-- ABOUT SECTION -->
    <section id="about" :class="LAYOUT_CONFIG.homeContentSection">
      <h2 :class="TYPOGRAPHY_CONFIG.homeSectionTitle">{{ UI_TEXT.home.aboutHeading }}</h2>
      <p :class="TYPOGRAPHY_CONFIG.homeSectionText">{{ UI_TEXT.home.aboutDescription }}</p>
    </section>

    <!-- SUPPORT SECTION -->
    <section id="support" :class="LAYOUT_CONFIG.homeContentSection">
      <h2 :class="TYPOGRAPHY_CONFIG.homeSectionTitle">{{ UI_TEXT.home.supportHeading }}</h2>
      <p :class="TYPOGRAPHY_CONFIG.homeSectionText">{{ UI_TEXT.home.supportDescription }}</p>
    </section>

    <!-- CONTACT SECTION -->
    <section id="contact" :class="LAYOUT_CONFIG.homeContentSection">
      <h2 :class="TYPOGRAPHY_CONFIG.homeSectionTitle">{{ UI_TEXT.home.contactUs }}</h2>
      <div :class="LAYOUT_CONFIG.actionGroupCenter">
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

defineProps<{
  featureCards: FeatureCard[];
  contactLinks: ContactLink[];
  activeCard: string | null;
}>();

const emit = defineEmits<{
  (e: 'toggleCard', id: string): void;
}>();
</script>
