import { ref, onMounted } from "vue";
import { getUserGroups } from "@/apis/list";

export function useGetHuatuoGroups() {
  const groups = ref([]);
  const loading = ref(false);
  const _getHuatuoGroups = async () => {
    try {
      loading.value = true;
      const { data } = await getUserGroups();
      groups.value = data;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => _getHuatuoGroups());

  return {
    groups,
    loading,
    _getHuatuoGroups,
  };
}
