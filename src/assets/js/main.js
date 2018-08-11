/* -----------------------------------------------------------------------------
 * MAIN
 */
//
// import './modules/class';
//
//
//

// import 'imports-loader?this=>window!./modules/modernizr.min';
import 'q';
import 'hammerjs';
import 'tinyscrollbar';
import {Tweenlite, CSSPlugin, ScrollToPlugin, EasePack} from "gsap/all";
import 'jquery.mb.ytplayer';

import './modules/class.js';
import 'expose-loader?entry!./modules/app.js';
import 'imports-loader?APP=>entry.APP!./modules/abstract.class.js';

import 'imports-loader?APP=>entry.APP!./modules/event_emitter.class.js';
import 'imports-loader?APP=>entry.APP,FastClick=fastclick,Q=q!./modules/app.class.js';
//
import 'imports-loader?APP=>entry.APP!./modules/header.class.js';
import 'imports-loader?APP=>entry.APP!./modules/password.class.js';
import 'imports-loader?APP=>entry.APP!./modules/home.class.js';
import 'imports-loader?APP=>entry.APP!./modules/project.class.js';
//
import 'imports-loader?APP=>entry.APP!./modules/mouse.class.js';
import 'imports-loader?APP=>entry.APP!./modules/keyboard.class.js';
import 'imports-loader?APP=>entry.APP!./modules/browser.class.js';
import 'imports-loader?APP=>entry.APP!./modules/css.class.js';
import 'imports-loader?APP=>entry.APP!./modules/images.class.js';
import 'imports-loader?APP=>entry.APP!./modules/ticker.class.js';
import 'imports-loader?APP=>entry.APP!./modules/navigation.class.js';
//

$(document).ready(() => {

	var page_type = $("input.page").val();

	var app = new entry.APP.CORE.App( {
    	page : page_type
	} );
	app.start();

  $('.about-trigger').click( () => {
    app.header.toggle()
   } );
});
