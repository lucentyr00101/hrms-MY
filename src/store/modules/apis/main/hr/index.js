import leaveTransactions from './leave-transactions'
import claimTransactions from './claim-transactions'
import loanTransactions from './loan-transactions'
import leaveBalance from './leave-balance'

export default {
  namespaced: true,
  modules: {
    leaveTransactions,
    claimTransactions,
    loanTransactions,
    leaveBalance
  }
}
