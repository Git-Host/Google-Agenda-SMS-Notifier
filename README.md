jQbrick
===========


`jQbrick` is a **modern web application template framework** who's objective is to mix up 
some really valid **OpenSource** projects, add some other code and release **a tool to 
build modern web apps easily and efficiently**.

It is built over `jQuery` and `BackboneJS`, it uses RequireJS for dependencies
management and optimization, and `jQueryMobile` as _first implemented UI toolkit_ 
to produce well structured MobileApps.

> I like to call `jQbrick` as _"Bricks for Mobile App Directors"_.

**jQbrick uses these Open Source libraries:**

- HTML5
- RequireJS
- jQuery
- UnderscoreJS
- BackboneJS
- jQueryMobile
- jQueryUI
- TwitterBootstrap
- LessCss
- ... and a lot of original code!



## Where does the name comes from?

- because of it's **modular design** I used the word **"brick"** to refer to 
  internal modules.
- because of it's **built over `jQuery`** I prefixed it with **"jQ"** to let people 
  know about it.

> I like the sound of it's complete name *"jay kubrik"* who remember me  
> the famous film director **Stanley Kubrick**.
> 
> And I like to figure **the developer as a director in a developement process**
> where actors are represented by modules: bricks!




## What's Included?

Forking or downloading `jQbrick` will provide you a fully functional test application
- a "kitchen sink" - where I put all provided features into a real Web/Mobile App.  
<small>(by now - early developement - you got only a test page, go to `/demo`)</small>

**Dependencies are also included** into the repo but you should fetch a fresh copy
from their own repositories.



## For the Web, For Mobile

`jQbrick` is not only for Mobile developement!  
**It isn't tied up to jQueryMobile!**

`jQbrick` should be used as a simple _jQuery+Backbone+RequireJs_ boilerplate who
provides some useful Backbone's object extensions to implement a _Component Architecture_ 
in your application.

> But by now i'm implementing it with `jQM` because I think `jQM` as the easiest 
> Mobile App Framework available on the web.  
> In future I wish to implement `AppFramework` UI components too and - why not - 
> other UI Kits!




## Targets:
- full AMD support
- HTML Driven App, JavaScript Driven App: are both welcome!
- declarative code! <small>I want you to read your sources as books on your Kindle!</small>
- run apps on iOS and Android browser (may be other platforms)
- run apps on GoogleChrome, Safari, Firefox (IE? What that s**t?)
- wrap project with PhoneGap, deploy on iOS and Android (may be other platforms)
- easy offline support for WebApp(s)





## Born To Be Optimized!
`jQbrick` comes with a built-in _RequireJS_ optimization script you can find 
under `/js` folder.

> **NOTE:** You do need _node.js_ running on your machine to perform following actions!

**How To Run Optimizer:**

- open a console window 
- navigate to the `/.../jQbrickProject/js/` folder
- `node r.js -o require.build.js`

a new folder named **"AppDeploy"** will be created under your app's root:  
`/.../jQbrickProject/AppDeploy/`

In that folder you can completely remove `/js` and `/less` directory obtaining a **optimized
production version** of you App!



