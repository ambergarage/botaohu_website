(function()
{
    'use strict';

    APP.COMPONENTS.Header = APP.CORE.Event_Emitter.extend(
    {
        options :
        {

        },

        /**
         * INIT
         */
        init: function( options )
        {
            this._super( options );

            this.active  = false;
            this.timeout = null;

            this.$.main            = $( 'header' );
            this.$.main_title      = $( 'a.main-title' );
            this.$.toggle          = $( 'a.toggle-header' );
            this.$.left            = this.$.main.find( '.left' );
            this.$.right           = this.$.main.find( '.right' );
            this.$.projects        = this.$.main.find( 'a.project' );
            this.$.button_contact  = this.$.main.find( 'a.contact' );
            this.$.button_projects = this.$.main.find( 'a.projects' );

            this.init_events();
            this.init_scrollbar();
            this.deactivate();
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;

            // Toggle click event
            this.$.toggle.on( 'click', function()
            {
                that.toggle();

                return false;
            } );

            // project link click event
            var x        = null,
                y        = null,
                distance = null;

            this.$.projects.on( 'click touchstart touchend', function( e )
            {
                var go_on = false,
                    touch = null;
                switch(e.type)
                {
                    case 'click':
                        go_on = true;
                        break;

                    case 'touchstart':
                        touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

                        x = touch.pageX;
                        y = touch.pageY;
                        break;

                    case 'touchend':
                        touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

                        x = Math.abs( x - touch.pageX );
                        y = Math.abs( y - touch.pageY );

                        distance = Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) );

                        if( distance < 5 )
                            go_on = true;

                        break;
                }

                if(go_on)
                {
                    var $project = $( this );

                    // Close header
                    that.deactivate();

                    // Trigger
                    that.trigger( 'project-click', [ $project.attr( 'href' ), $project.data( 'direction' ) ] );

                    return false;
                }
            } );

            // Contact click event
            this.$.button_contact.on( 'click', function()
            {
                that.$.button_contact.addClass( 'active' );
                that.$.button_projects.removeClass( 'active' );
                that.$.left.removeClass( 'hidden' );
                that.$.right.addClass( 'hidden' );

                return false;
            } );

            // Projects click event
            this.$.button_projects.on( 'click', function()
            {
                that.$.button_contact.removeClass( 'active' );
                that.$.button_projects.addClass( 'active' );
                that.$.left.addClass( 'hidden' );
                that.$.right.removeClass( 'hidden' );

                return false;
            } );
        },

        /**
         * INIT SCROLLBAR
         */
        init_scrollbar: function()
        {
            var that = this;

            this.scrollbar          = {};
            this.scrollbar.timeout  = null;
            this.scrollbar.instance = null;

            this.$.right.tinyscrollbar();

            this.scrollbar.instance = this.$.right.data( 'plugin_tinyscrollbar' );

            this.$.right.bind( 'move', function()
            {
                // that.$.right.addClass( 'scroll-active' );

                // if( that.scrollbar.timeout )
                //     window.clearTimeout( that.scrollbar.timeout );

                // that.scrollbar.timeout = window.setTimeout( function()
                // {
                //     that.$.right.removeClass( 'scroll-active' );
                // }, 500 );
            });
        },

        /**
         * TOGGLE
         */
        toggle: function()
        {
            if( this.active )
                this.deactivate();
            else
                this.activate();
        },

        /**
         * ACTIVATE
         */
        activate: function()
        {
            var that = this;

            this.$.main.css( { display : 'block' } );

            this.timeout = window.setTimeout( function()
            {
                that.$.main.addClass( 'active' );
                that.scrollbar.instance.update();
            }, 100 );

            this.active = true;

            this.trigger( 'activate' );
        },

        /**
         * DEACTIVATE
         */
        deactivate: function()
        {
            var that = this;

            this.$.main.removeClass( 'active' );

            this.timeout = window.setTimeout( function()
            {
                that.$.main.css( { display : 'none' } );
            }, 500 );

            this.active = false;

            this.trigger( 'deactivate' );
        },

        /**
         * START
         */
        start: function()
        {

        }
    });
})();
