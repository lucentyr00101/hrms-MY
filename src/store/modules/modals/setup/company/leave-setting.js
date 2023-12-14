export const state = {
  leaveSettingModal: false
}

export const getters = {
  leaveSettingModal: (state) => state.leaveSettingModal
}

export const mutations = {
  TOGGLE_LEAVE_SETTING_MODAL: (state) => {
    state.leaveSettingModal = !state.leaveSettingModal
  }
}
