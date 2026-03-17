<template>
  <button
    class="theme-toggle"
    :class="`theme-toggle--${theme}`"
    type="button"
    :title="theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'"
    :aria-label="theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'"
    @click="toggle"
  >
    <svg v-if="theme === 'dark'" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 0010 9.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'theme-toggle',
  setup() {
    const store = useStore();
    const theme = computed(() => store.getters.getTheme);

    const toggle = () => {
      store.commit('setTheme', theme.value === 'dark' ? 'light' : 'dark');
    };

    return { theme, toggle };
  },
});
</script>

<style lang="scss">
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    border-color: #29a0f5;
    color: #29a0f5;
  }

  &--dark {
    color: #f5c542;

    &:hover {
      color: #f5c542;
      border-color: #f5c542;
    }
  }
}
</style>
