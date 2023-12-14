
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default {
  path: '/interview',
  name: 'interview',
  meta: { title: 'menu.interview', icon: 'user-fill', permission: ['interview'] },
  redirect: '/interview/candidate',
  component: RouteView,
  children: [
    {
      path: '/interview/candidate',
      name: 'interview-candidate',
      meta: { title: 'menu.candidate', permission: ['interview_candidate'] },
      component: () => import('@/views/interview/Candidate')
    },
    {
      path: '/interview/interview',
      name: 'interview-interview',
      meta: { title: 'menu.interview', permission: ['interview_interview'] },
      component: () => import('@/views/interview/Interview')
    },
    {
      path: '/interview/position',
      name: 'interview-position',
      meta: { title: 'menu.position', permission: ['interview_position'] },
      component: () => import('@/views/interview/Position')
    }

  ]
}
