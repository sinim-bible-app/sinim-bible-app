import { ref } from "vue";
import { defineStore } from "pinia";

export const useNavStore = defineStore("nav", () => {
    const showNav = ref(true);

    function toggleNav() {
        showNav.value = !showNav.value;
    }

    return {
        showNav,
        toggleNav,
    };
});
