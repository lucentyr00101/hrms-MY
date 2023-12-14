<template>
  <div class="action-container">
    <a-row :gutter="[25, 25]">
      <a-col :xl="{ span: 6 }" :lg="{ span: 12 }" v-for="(item, i) in data" :key="i">
        <a :href="item.href">
          <a-card class="action-btn">
            <img :class="'btn-img-' + item.index" :src="item.imgSrc" />
            {{ item.title }}
          </a-card>
        </a>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { i18nRender } from '@/locales'
const data = [
  {
    index: 0,
    title: i18nRender('dashboard.analysis.action.attendance'),
    href: '/main/employee-management/attendance-list',
    imgSrc: 'icons/Attendance Icon.svg',
    imgSrcActive: 'icons/Attendance Icon-w.svg'
  },
  {
    index: 1,
    title: i18nRender('dashboard.analysis.action.claim'),
    href: '/main/hr/claim-transactions',
    imgSrc: 'icons/Claim Icon.svg',
    imgSrcActive: 'icons/Claim  Icon-w.svg'
  },
  {
    index: 2,
    title: i18nRender('dashboard.analysis.action.work-reports'),
    href: '/main/employee-management/work-report-list',
    imgSrc: 'icons/Work Report Icon.svg',
    imgSrcActive: 'icons/Work Report Icon-w.svg'
  },
  {
    index: 3,
    title: i18nRender('dashboard.analysis.action.leave'),
    href: '/main/hr/leave-transactions',
    imgSrc: 'icons/Leave Icon.svg',
    imgSrcActive: 'icons/Leave Icon-w.svg'
  },
  {
    index: 4,
    title: i18nRender('dashboard.analysis.action.announcement'),
    href: '/setup/company/announcment',
    imgSrc: 'icons/Announcement Icon.svg',
    imgSrcActive: 'icons/AnnouncementIcon-w.svg'
  },
  {
    index: 5,
    title: i18nRender('dashboard.analysis.action.library'),
    href: '/setup/company/library',
    imgSrc: 'icons/Library Icon.svg',
    imgSrcActive: 'icons/Library Icon-w.svg'
  },
  {
    index: 6,
    title: i18nRender('dashboard.analysis.action.assets'),
    href: '/main/employee-management/assets-list',
    imgSrc: 'icons/Assets Icon.svg',
    imgSrcActive: 'icons/Assets Icon-w.svg'
  },
  {
    index: 7,
    title: i18nRender('dashboard.analysis.action.payslip'),
    href: '/main/m-payroll/generate',
    imgSrc: 'icons/Payslip Icon.svg',
    imgSrcActive: 'icons/Payslip Icon-w.svg'
  }
]
export default {
  name: 'ActionSection',
  data() {
    return {
      data,
      selectedIndex: null
    }
  },
  methods: {
    handleActive(selectedIndex) {
      this.selectedIndex = selectedIndex
      console.log(this.selectedIndex)
    }
  }
}
</script>

<style lang="less">
@import '~ant-design-vue/es/style/themes/default.less';

[data-theme='realdark'] {
  .action-container {
    .action-btn {
      background-color: #141414;
    }
  }
}
.action-container {
  .action-btn {
    border: none;
    background-color: white;
    border-radius: 10px;
    font-size: 14px;
    color: #5f63f2;
    font-weight: 500;
    align-items: center;
    text-align: center;
    align-content: center;
    padding-left: 10%;
    & .ant-card-body {
      flex-wrap: nowrap !important;
      display: flex !important;
      align-items: center !important;
    }

    & img {
      margin-right: 20px;
      background-color: @primary-color;
      border-radius: 20%;
    }
    &:active {
      background-color: @primary-color;
      color: white;
      border: none;
    }
  }
}
</style>
