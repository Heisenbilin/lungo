import { reactive, ref, computed, onMounted } from 'vue';
import { TableState } from 'ant-design-vue/es/table/interface';
import type { LogQuery } from './api';
import { getLogs } from './api';

type DateTime = {
  start_time: string;
  end_time: string;
};

type Pagination = TableState['pagination'];
/**
 * 获取操作日志列表
 */
export const useGetLogs = () => {
  /**
   * 查询参数
   */
  const query = reactive<LogQuery>({
    user_account: '',
    action: undefined,
    project_name: '',
    data_field: '',
    start_time: undefined,
    end_time: undefined,
    page: 1,
    page_size: 10,
  });

  const logs = ref([]);
  const loading = ref<boolean>(false);
  const total = ref<number>(0);

  /**
   * 切换时间
   */
  const onDateChange = ({ start_time, end_time }: DateTime) => {
    query.start_time = start_time;
    query.end_time = end_time;
  };

  const _getLogs = async () => {
    try {
      loading.value = true;
      // @ts-ignore
      const { data, stat } = await getLogs(query);

      logs.value = stat === 1 ? data.logs : [];
      total.value = stat === 1 ? data.total : 0;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  /**
   * 点击搜索按钮
   */
  const handleSearch = () => {
    query.page = 1;
    _getLogs();
  };

  /**
   * 分页相关
   */
  const pagination = computed<Pagination>(() => ({
    total: total.value,
    current: query.page,
    pageSize: query.page_size,
    showSizeChanger: true,
  }));

  const handleTableChange = (pagination: Pagination) => {
    query.page = pagination?.current ?? 1;
    query.page_size = pagination?.pageSize ?? 10;
    _getLogs();
  };

  onMounted(() => {
    _getLogs();
  });

  return {
    query,
    pagination,
    logs,
    onDateChange,
    handleTableChange,
    handleSearch,
    loading,
    total,
  };
};
