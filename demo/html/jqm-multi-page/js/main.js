/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Html Driven App Demo
 * Multi Page App
 *
---

This demo run a very simple application who display 3 mobile
pages who are defined into separated HTML files.

Internal pages are loaded by `jQM` framework with an 
_Ajax Request_ and are injected into the DOM automatically.

> Internal pages are also automatically removed on `pagehide`  
> event so DOM remain concise and App's memory usage is low.

## When to code this way?

This method of writing applications is extremely useful for large **content
based** applications who are more **like big menus + detail pages** than computational
applications.

- city maps
- products catalogues
- books / movies / songs reviews
- other

All these apps have 90% static content and - may be - 10% of dynamic generated 
contents (like bookmarks) or internet driven plugins (es. Google Maps).

You should enjoy writing down simple HTML pages filled up with links and contents then
write some **delegation logic** files to **handle user interaction**.



## Configuring jQueryMobile Defaults

`jQbrick`'s initialization utility allow you to configure `jQueryMobile` defaults
using `jqmDefaults` property:

	jQbrick.App({
		jqmDefaults: {
			ajaxEnabled: true
		}
	});

You can implement every setting as explained in 
[`jQueryMobile`'s documentation page](http://api.jquerymobile.com/global-config/)




## App's Namespace

After app initialization code we've used an unknown `App` property as a _namespace_
object giving it some properties to store counters.

Well, this is not an unknown property at all.  
It was created by `jQbrick.App()` method at initialization time!

[Read more about App Namespace &raquo;](todo)




## Distribute Delegation Logic

As we are creating a _multi page_ app we want to separate each page events handlers 
logic from each other.

> This is a convenient way to keep your code simple and modular.  
> When production time comes you can optimize it into a single minified file!

We can place our delegation source files into `js/Delegate` folder then define then
as dependencies for our application AMD:

	define([
		"jquery",
		"jqbrick",
		
		// Delegate Dependencies
		"delegate/page1",
		"delegate/page2"
		
	], function(
		$,
		jQbrick
		
	) {
	...

Each delegation file is structured with an AMD module who contains many 
**delegation handling logic** this way:

	define("jquery", function($) {
		$(document).delegate("#pageXXX", "pageshow", function() {
			... event handling code ...
		});
	});

> It it important to understand you can refer to **application namespace** only
> from inside event handlers!  
> <small>Event handler code run as response to a user interaction and an user can
> interact only after application initialization process.</small>
>
> Code outside handlers run at script loading time who happen before initialization 
> because **these files are required as dependencies by application main AMD**!

---
 *
 */


define([
	"jquery",
	"jqbrick",
	"delegate/page1",
	"delegate/page2"
	
], function(
	$,
	jQbrick
	
) {
	
	
	/**
	 * Startup Application
	 * configure jQueryMobile to handle ajax requests for links
	 */
	jQbrick.App({
		jqmDefaults: {
			ajaxEnabled: true
		}
	});
	
	
	/**
	 * Setup page counters default values within 
	 * the newly created App namespace.
	 */
	App.counters = {
		page1: 0,
		page2: 0
	};
	
			
});