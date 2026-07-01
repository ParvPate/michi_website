<script setup lang="ts">
interface AboutItem {
  file: string
  tag: string
  role: 'anchor' | 'satellite'
}
const { data: items } = await useFetch<AboutItem[]>('/api/data/about-tags', {
  key: 'about-tags',
})

const anchor = computed(() => items.value?.find(i => i.role === 'anchor'))
const satellites = computed(() => items.value?.filter(i => i.role === 'satellite') ?? [])
</script>

<template>
  <UiSectionShell id="about" bg="primary">
    <div class="section-about">

      <!-- A) Founder note -->
      <header class="section-about__head">
        <UiSectionEyebrow dot>FROM THE FOUNDER</UiSectionEyebrow>
        <h2 class="type-display-md section-about__headline">
          Built for what's
          <span class="type-italic" style="color: var(--brand);">outside.</span>
        </h2>
        <p class="type-body-lg section-about__story">
          The apps I opened most were the ones I liked least. Feeds,
          friend counts, performance reviews of my own life. I wanted
          the opposite — an app you close after thirty seconds because
          you're already on your way somewhere. Michi does one thing:
          it helps you find a plan, show up, and meet the people who
          showed up too. The rest of the night is the point.
        </p>
      </header>

      <!-- B) Overlap cards -->
      <div class="section-about__team">

        <!-- Left satellites -->
        <figure
          v-for="(sat, i) in satellites.slice(0, 2)"
          :key="sat.file"
          class="team-card team-card--side"
        >
          <span class="team-card__media">
            <NuxtImg
              :src="`/about/${sat.file}`"
              :alt="sat.tag"
              width="400"
              height="500"
              loading="lazy"
              fit="cover"
            />
          </span>
          <figcaption class="team-card__caption">
            <span class="type-caption team-card__role">{{ sat!.tag.split('·').at(0)?.trim() }}</span>
            <span class="team-card__name">{{ sat!.tag.split('·').at(1)?.trim() }}</span>
          </figcaption>
        </figure>

        <!-- Anchor — CEO, tall center card -->
        <figure v-if="anchor" class="team-card team-card--anchor">
          <span class="team-card__media">
            <NuxtImg
              :src="`/about/${anchor!.file}`"
              :alt="anchor!.tag"
              width="500"
              height="700"
              loading="lazy"
              fit="cover"
            />
          </span>
          <figcaption class="team-card__caption">
            <span class="type-caption team-card__role">{{ anchor!.tag.split('·').at(0)?.trim() }}</span>
            <span class="team-card__name">{{ anchor!.tag.split('·').at(1)?.trim() }}</span>
          </figcaption>
        </figure>

        <!-- Right satellites -->
        <figure
          v-for="(sat, i) in satellites.slice(2)"
          :key="sat.file"
          class="team-card team-card--side"
        >
          <span class="team-card__media">
            <NuxtImg
              :src="`/about/${sat.file}`"
              :alt="sat.tag"
              width="400"
              height="500"
              loading="lazy"
              fit="cover"
            />
          </span>
          <figcaption class="team-card__caption">
            <span class="type-caption team-card__role">{{ sat.tag.split('·').at(0)?.trim() }}</span>
            <span class="team-card__name">{{ sat.tag.split('·').at(1)?.trim() }}</span>
          </figcaption>
        </figure>

      </div>

    </div>
  </UiSectionShell>
</template>

<style scoped>
.section-about {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.section-about__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 36rem;
  margin-left: auto;
}
@media (min-width: 1024px) {
  .section-about__head {
    margin-right: 8%;
  }
}

.section-about__headline {
  margin: 0;
  text-wrap: balance;
}
.section-about__story {
  margin: 0;
  color: var(--ink-secondary);
}

/* ----------------------------------------------------------------
 *  Overlap cards team layout
 * ---------------------------------------------------------------- */
.section-about__team {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .section-about__team {
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--space-6);
  }
}

.team-card {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  flex-shrink: 0;
}

/* Side cards */
.team-card--side {
  width: clamp(210px, 30vw, 300px);
}
.team-card--side .team-card__media {
  height: clamp(270px, 39vw, 390px);
}

/* Anchor card */
.team-card--anchor {
  width: clamp(270px, 39vw, 390px);
  position: relative;
  z-index: 1;
}
.team-card--anchor .team-card__media {
  height: clamp(360px, 54vw, 540px);
}

@media (min-width: 768px) {
  .team-card--side:nth-child(2) {
    margin-right: 0;
  }
  .team-card--anchor {
    margin-inline: 0;
  }
}

.team-card__media {
  display: block;
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #ECE6D8, #D6CFBE);
  transition: transform 500ms var(--ease-out-quart);
}
.team-card__media :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

@media (hover: hover) and (pointer: fine) {
  .team-card:hover .team-card__media {
    transform: scale(1.02) translateY(-4px);
  }
}

.team-card__caption {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.team-card__role {
  color: var(--ink-muted);
  letter-spacing: 0.1em;
  font-size: 0.75rem;
}

.team-card__name {
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--ink-primary);
  line-height: 1.2;
}
</style>
