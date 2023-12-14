export default {
  path: '/setup/dictionary',
  name: 'setup-dictionary',
  meta: { title: 'menu.dictionary', icon: 'user', permission: ['setup_dictionary'] },
  component: () => import('@/views/setup/dictionary/List')
}
