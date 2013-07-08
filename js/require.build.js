/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * RequireJs Optimizer Configuration
 * 
 * It creates an "/AppDeploy" directory under your App's project folder.
 * After that you can remove "/AppDeploy/js/" and "/AppDeploy/less/" folders to reduce
 * production folder size.
 *
 * Please be carefull to remove hidden ".git" folder who can be quite heavy!
 */

({
	
	
	/**
	 * PRODUCTION FOLDER PATH
	 * Here you can configure where to save production files
	 */
	dir: 		'../AppDeploy/',
	
	
	/**
	 * UGLIFICATION & COMPRESSION
	 * optimized files are uglified and compressed by default.
	 * uncomment this instruction to skip uglification and obtain
	 * a single source file who still be debuggable!
	 */
	//optimize: "none",
	
	
	
	
	appDir: 	'../',
	baseUrl: 	'./',
	mainConfigFile: "../require.app.js",
	modules:	[{name:'require.app'}]
	
})

