<template>
  <div>
    <action-section />
    <leave />
    <ot-approved />
  </div>
</template>

<script>
import Leave from './Leave'
import OtApproved from './OtApproved'
import ActionSection from './ActionSection'
export default {
  components: { OtApproved, Leave, ActionSection },
  name: 'PersonalDashboard'
}
</script>
