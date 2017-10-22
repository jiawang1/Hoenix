# Hoenix
![](https://img.shields.io/badge/license-MIT-000000.svg) ![](https://img.shields.io/badge/release-0.2-green.svg)

UX boilerplate for Admin page base on React, Redux and Ant Design widget.


### Quick Start
You can get source code from git or just down load code. Then run

````shell
 npm install
````
 after install the dependency, run 

````shell
 npm start
````
then open url http://localhost:8012/hoenix/_admin/

### Features
Hoenix base on React, and integrates some other open sources: 
1. Redux and react-redux to manage front end states. 
2. React-router to control routes, also react-router-redux to sync router realted state to store.
3. Redux-thunk to support side effects, but also integrates Redux-saga.(will adapt to redxu-saga gradually)
4. Mocha and enzyme implements unit test, to simulate DOM API via JSDom.
5. Using AntD as front end widgets library.
6. LESS for UX styles.
7. For build process, Hoenix depends on Webpack(3.X). Support development and production build mode.

### How to develop base on Hoenix


### Next step
I am currently focusing on supporting server side rendering feature.

### License
MIT
