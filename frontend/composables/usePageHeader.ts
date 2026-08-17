import { ref } from "vue";

// Module-level singleton (same pattern as useAuth.ts) so app.vue's header
// and any page can share one reactive value without prop drilling.
const pageHeaderOverride = ref<{ title: string; backTo: string } | null>(
  null,
);

export function usePageHeader() {
  function setPageHeader(title: string, backTo: string = "/") {
    pageHeaderOverride.value = { title, backTo };
  }

  function clearPageHeader() {
    pageHeaderOverride.value = null;
  }

  return {
    pageHeaderOverride,
    setPageHeader,
    clearPageHeader,
  };
}