import {
  DefaultPage,
} from './index';

export default {
  path: 'sample',
  siteIndexRoute: { component: DefaultPage },
  text:"欢迎",
  childRoutes: [
    { path: 'default-page', component: DefaultPage, text: "样例页面" },
  ],
};
