export default defineAppConfig({
  pages: [
    'pages/reading-plan/index',
    'pages/bookshelf/index',
    'pages/discussion/index',
    'pages/borrow/index',
    'pages/review/index',
    'pages/book-detail/index',
    'pages/publish-book/index',
    'pages/add-book/index',
    'pages/add-excerpt/index',
    'pages/borrow-apply/index',
    'pages/member-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#8B5A2B',
    navigationBarTitleText: '读书会',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FAF8F5'
  },
  tabBar: {
    color: '#8D6E63',
    selectedColor: '#8B5A2B',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/reading-plan/index',
        text: '共读计划'
      },
      {
        pagePath: 'pages/bookshelf/index',
        text: '成员书架'
      },
      {
        pagePath: 'pages/discussion/index',
        text: '讨论摘录'
      },
      {
        pagePath: 'pages/borrow/index',
        text: '借阅流转'
      },
      {
        pagePath: 'pages/review/index',
        text: '活动回顾'
      }
    ]
  }
})
