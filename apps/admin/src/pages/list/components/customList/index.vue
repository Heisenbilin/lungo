<template>
  <div class="flex flex-wrap">
    <div class="p-1 w-1/3">
      <RouterLink to="/monitor/custom">
        <a-card hoverable style="width: 300px">
          <template #actions>
            <setting-outlined />
            <edit-outlined />
            <ellipsis-outlined />
          </template>
          <a-card-meta title="购课监控看板" description="This is the description">
            <template #avatar>
              <a-avatar src="https://joeschmoe.io/api/v1/random" />
            </template>
          </a-card-meta>
        </a-card>
      </RouterLink>
    </div>
    <div class="p-1 w-1/3">
      <a-card hoverable style="width: 300px">
        <template #actions>
          <setting-outlined />
          <edit-outlined />
          <ellipsis-outlined />
        </template>
        <a-card-meta title="日志监控看板" description="This is the description">
          <template #avatar>
            <a-avatar src="https://joeschmoe.io/api/v1/random" />
          </template>
        </a-card-meta>
      </a-card>
    </div>
    <div class="p-1 w-1/3">
      <a-card hoverable style="width: 300px">
        <template #actions>
          <setting-outlined />
          <edit-outlined />
          <ellipsis-outlined />
        </template>
        <a-card-meta title="网络监控看板" description="This is the description">
          <template #avatar>
            <a-avatar src="https://joeschmoe.io/api/v1/random" />
          </template>
        </a-card-meta>
      </a-card>
    </div>
    <div class="p-1 w-1/3">
      <a-card hoverable style="width: 300px">
        <template #actions>
          <setting-outlined />
          <edit-outlined />
          <ellipsis-outlined />
        </template>
        <a-card-meta title="课堂监控看板" description="This is the description">
          <template #avatar>
            <a-avatar src="https://joeschmoe.io/api/v1/random" />
          </template>
        </a-card-meta>
      </a-card>
    </div>
    <div class="p-1 w-1/3">
      <a-card hoverable style="width: 300px">
        <template #actions>
          <setting-outlined />
          <edit-outlined />
          <ellipsis-outlined />
        </template>
        <a-card-meta title="性能监控看板" description="This is the description">
          <template #avatar>
            <a-avatar src="https://joeschmoe.io/api/v1/random" />
          </template>
        </a-card-meta>
      </a-card>
    </div>
    <div class="p-1 w-1/3">
      <a-card hoverable style="width: 300px">
        <template #actions>
          <setting-outlined />
          <edit-outlined />
          <ellipsis-outlined />
        </template>
        <a-card-meta title="整合看板" description="This is the description">
          <template #avatar>
            <a-avatar src="https://joeschmoe.io/api/v1/random" />
          </template>
        </a-card-meta>
      </a-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
</script>
