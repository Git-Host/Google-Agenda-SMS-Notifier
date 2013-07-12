# jQbrick

`jQbrick` is a **components library for Mobile Apps developement**.  
It is build over `jQuery` and `BackboneJS`, it uses RequireJS for dependencies and optimization and `jQueryMobile` as _first implemented UI toolkit_ to produce well structured MobileApps.

> I like do call it _"Bricks for Mobile App Directors"_.


## Where "jQbrick" cames from?
`jQbrick` comes from a `jQMBR` reengineering process.  
The name is a mix of "bricks" to highlight the **components library** nature of this project.

You speak "jQubrick" as "jay" + "Kubrick" (the American film director).  
I like to refer to a very important film director because - in my intention - **you will use
`jQbrick` components as actors in you Mobile Application**.




## What's Provided?

Forking or downloading this repo will provide you a fully functional test application,
a "kitchen sink" where I put all provided features into a real Mobile App.  
(by now - early developement - you got running tests...)



## For Web, For Mobile
`jQbrick` is not only for Mobile developement!  
It isn't tied to jQueryMobile!

`jQbrick` should be used as a simple _jQuery+Backbone+RequireJs_ boilerplate who provides
some useful Backbone extensions object to implement components in your application.

By now i'm implementing it with `jQM` because I think `jQM` the easiest Mobile App Framework on the web.  
In future I wish to implement `AppFramew` UI components too!


## Documentation:
To create documentation it is a real challenge for no-profit projects!  
For the moment all documentation is provieded through comments in demonstrational code blocks
but I hope to find the time to write down a wiki here in GitHub!

Contributors are welcome!


## Targets:
- full AMD
- no static HTML, JS templates are welcome
- code declarative!
- run apps on iOS and Android browser
- run apps on GoogleChrome, Safari, Firefox (IE? What that s**t?)
- wrap apps with PhoneGap, deploy on iOS and Android

## Optimized for Production:
`jQbrick` comes with a built-in _RequireJS_ optimization script you can find under `/js` folder.

**NOTE:** You need _node.js_ running on your machine to perform following actions!

To run optimizer:
- open a console window 
- navigate to the `.../jQbrick/js/` folder
- `node r.js -o require.build.js`

a new folder named **"AppDeploy"** will be created under your app's root:  
`.../jQbrick/AppDeploy/`

Here you can completely remove `/js` and `/less` directory obtaining a **compressed
production version** of you App!
