<template>
  <div class="status-cards">
    <div class="status-card">
      <span class="bold">{{ $t('dashboard.analysis.table.date') }}: </span> {{ dateAndTime }}
    </div>
    <div class="status-card">
      <span class="bold">{{ $t('dashboard.analysis.table.status') }}:</span>
      <span v-if="statusMsg" :style="{ color: this.statusColor, fontSize: '20px' }">{{ statusMsg.toUpperCase() }}</span>
    </div>
    <div class="status-card">
      <span class="bold">{{ $t('dashboard.analysis.table.logged-in') }}:</span> {{ loggedIn }}
    </div>
    <div class="status-card">
      <span class="bold">{{ $t('dashboard.analysis.table.work-time') }}:</span> {{ workDuration }}
    </div>
    <div v-action:dashboard_update-work-status class="status-card-button">
      <a-button icon="plus" type="link" />
      <span class="button-text"> {{ handleStatus(statusAction) }} </span>
      <a-popover placement="bottomRight">
        <template slot="content">
          <a-list :data-source="statusList">
            <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
              <a @click="handleAction(item.message)"><a-list-item-meta :title="item.message" /></a>
            </a-list-item>
          </a-list>
        </template>
        <a-button icon="ellipsis" type="link" />
      </a-popover>
    </div>

    <a-modal
      @ok="handleSubmit"
      :width="550"
      v-model="attendancePop"
      @cancel="closeModal"
      :title="$t('table.dialog.attendance-pop-up')"
    >
      <a-alert :message="warningMessage" banner>
        <a-icon slot="icon" type="info-circle" theme="filled" />
      </a-alert>

      <a-row style="margin-top: 20px">
        <a-col class="Clabel" :span="7">{{ $t('table.column.employee') }} :</a-col>
        <a-col :span="17"> {{ fullName }} </a-col>
      </a-row>
      <a-row style="margin-top: 20px">
        <a-col class="Clabel" :span="7">{{ $t('table.column.attendance-type') }} :</a-col>
        <a-col :span="17"> {{ selectedStatus }} </a-col>
      </a-row>
      <a-row style="margin-top: 20px">
        <a-col class="Clabel" :span="7">{{ $t('table.column.date-and-time') }} :</a-col>
        <a-col :span="17"> {{ dateTimeNow }} </a-col>
      </a-row>
      <a-form style="margin-top: 20px" :form="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
        <a-form-item :label="`${$t('table.column.remarks')}:`">
          <a-input
            type="textarea"
            :rows="1"
            mode="tags"
            :maxLength="100"
            v-decorator="[
              'remarks',
              {
                rules: [{ required: true, message: $t('error.remarks.required') }]
              }
            ]"
          >
          </a-input
        ></a-form-item>
        <a-form-item
          :label="selectedStatus === 'Time In' ? $t('table.column.time-in-type') : $t('table.column.time-out-type')"
        >
          <a-select
            show-search
            :options="attendaceTypeList"
            placeholder="Select"
            v-decorator="[
              'workAction',
              {
                rules: [
                  {
                    required: true,
                    message:
                      selectedStatus === 'Time In'
                        ? $t('error.time-in-type.required')
                        : $t('error.time-out-type.required')
                  }
                ]
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

// static values for now api requirements
const statusList = [
  { message: 'Time In' },
  { message: 'Start Break' },
  { message: 'End Break' },
  { message: 'Time Out' }
]

export default {
  name: 'UserStatus',
  data() {
    return {
      form: this.$form.createForm(this),
      attendancePop: false,
      statusList,
      statusAction: null,
      statusColor: null,
      statusMsg: null,
      loggedIn: null,
      workDuration: null,
      attendaceType: [],
      warningMessage: null,
      selectedStatus: null,
      attendaceTypeList: [],
      errorType: null,
      errorAction: null,
      timeInterval: null,
      statusInterval: null,
      dateAndTime: null
    }
  },
  beforeDestroy() {
    clearInterval(this.timeInterval)
    clearInterval(this.statusInterval)
  },
  async created() {
    this.timeInterval = setInterval(() => {
      this.dateAndTime =
        new Date().toLocaleDateString('zh-Hans-CN') + ' ' + new Date().toLocaleTimeString().replace(/AM|PM/, '')
    }, 1000)

    this.statusInterval = setInterval(async () => {
      await this.getStatus()
    }, 60 * 1000)
    this.initialize()
  },
  watch: {
    selectedStatus() {
      let attendance

      switch (this.selectedStatus) {
        case 'Time In':
          attendance = [
            { label: 'Late Time In', value: 'Late Time In' },
            { label: 'Forgot to Time In', value: 'Forgot to Time In' }
          ]
          break
        case 'Time Out':
          if (this.errorType === 'less than') {
            attendance = [{ label: 'Early Time Out', value: 'Early Time Out' }]
          } else {
            attendance = [
              { label: 'Overtime', value: 'Overtime' },
              { label: 'Forgot to Time Out', value: 'Forgot to Time Out' }
            ]
          }
          break

        default:
          attendance = []
          break
      }
      this.attendaceTypeList = attendance
    }
  },
  computed: {
    ...mapGetters('api/auth', ['currentUser']),
    fullName() {
      return this.currentUser.lastName + ', ' + this.currentUser.firstName
    },
    dateTimeNow() {
      return moment().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    async getStatus() {
      const { data } = await this.$store.dispatch('api/dashboard/main/userWorkDetail')

      this.statusColor = data?.color || 'black'
      this.statusMsg = data?.workStatus || '-'
      this.statusAction = data?.workAction || '-'
      this.workDuration = data?.workTimeDuration !== '0' ? data?.workTimeDuration : '-'
      this.loggedIn = data?.loginTime !== '0' ? data?.loginTime : '-'
    },
    async initialize() {
      await this.getStatus()
      const { data: attendance } = await this.$store.dispatch('api/dropdown/fetchAttendanceDropdown')
      this.attendaceType = attendance?.employeeSetupAttendanceTypes?.map((item) => {
        return {
          label: item.attendanceType,
          value: item.attendanceType
        }
      })
    },
    async handleAction(currentMessage) {
      this.errorType = null
      this.errorAction = null

      if (currentMessage !== null) {
        const { data } = await this.$store.dispatch('api/dashboard/main/updateStatus', {
          workAction: currentMessage
        })
        if (data?.workStatusErrorMessage && data) {
          this.attendancePop = true
          this.warningMessage = data?.workStatusErrorMessage
          this.errorType = data?.errorType
          this.errorAction = data?.errorAction
        } else {
          setTimeout(() => {
            this.initialize()
          }, 2000)
        }
        this.selectedStatus = currentMessage
      }
    },
    handleStatus(status) {
      let generalStatus
      switch (status) {
        case 'Off Work':
        case 'Overtime':
        case 'Early Time Out':
          generalStatus = 'Time Out'
          break
        case 'Working':
        case 'Late Time In':
        case 'Forgot to Time In':
          generalStatus = 'Time In'
          break
        default:
          generalStatus = status
          break
      }
      return generalStatus
    },
    closeModal() {
      this.form.resetFields()
      this.attendancePop = false
    },
    handleSubmit() {
      this.form.validateFields((err, values) => !err && this.submitForm())
    },
    async submitForm() {
      await this.$store.dispatch('api/dashboard/main/updateStatus', {
        workAction: this.form.getFieldValue('workAction'),
        remarks: this.form.getFieldValue('remarks')
      })
      await setTimeout(() => {
        this.initialize()
      }, 2000)
      this.closeModal()
    }
  }
}
</script>

<style lang="less" scoped>
[data-theme='realdark'] {
  .status-card {
    background-color: #141414;
  }
}

.Clabel {
  text-align: right;
  padding-right: 9px;
  color: black;
}

.status-cards {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.button-text {
  color: white;
  font-size: 16px;
}
.status-card {
  background-color: white;
  width: 20%;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-weight: 500;
  font-size: 16px;
  .bold {
    font-weight: bolder;
    margin-right: 5px;
  }
  &-button {
    background: #ff6385;
    width: max-content;
    border-radius: 10px;
    align-items: center;
    text-align: center;
    display: flex;
    padding: 20px;
    .ant-btn-link {
      background-color: none;
      color: white;
      margin: 0 5px 0 5px;
    }
  }
}

@media (max-width: 1200px) {
  .status-cards {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 15px;
  }
  .status-card {
    justify-content: left;
    width: 80%;
  }
}
</style>
