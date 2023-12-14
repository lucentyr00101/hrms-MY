<template>
  <span :style="{color:EMPLOYEE_STATUS_COLOR[status]}">
    {{ status !== 'All' ? EMPLOYEE_STATUS_VALUE_NAME[status] : '' }}
  </span>
</template>

<script>
import { EMPLOYEE_STATUS_VALUE, EMPLOYEE_STATUS_VALUE_NAME } from '@/constant/enum'
const EMPLOYEE_STATUS_COLOR = {
   [EMPLOYEE_STATUS_VALUE.ACASUAL]: '#52C41A',
   [EMPLOYEE_STATUS_VALUE.APROBATION]: '#52C41A',
   [EMPLOYEE_STATUS_VALUE.AREGULAR]: '#52C41A',
   [EMPLOYEE_STATUS_VALUE.RCASUAL]: '#F00F0F',
   [EMPLOYEE_STATUS_VALUE.RPROBATION]: '#F00F0F',
   [EMPLOYEE_STATUS_VALUE.RREGULAR]: '#F00F0F'
}
export default {
    name: 'EmployeeStatus',
    props: {
        status: { type: String, default: '' }
    },
    data () {
        return {
            EMPLOYEE_STATUS_COLOR,
            EMPLOYEE_STATUS_VALUE_NAME
        }
    }
}
</script>

<style>
</style>
