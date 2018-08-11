(function()
{
    'use strict';

    APP.COMPONENTS.Home = APP.CORE.Event_Emitter.extend(
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

            this.browser    = new APP.TOOLS.Browser();
            this.navigation = new APP.TOOLS.Navigation();
            this.type       = 'home';
            this.active     = true;
            this.updates_count = 0;

            this.$.main           = $( '.page.home' );
            this.$.projects       = this.$.main.find( '.line.project' );
            // this.$.projects_links = this.$.projects.find( 'a.ajax' );
            this.$.list           = this.$.main.find( '.projects-list' );
            this.$.list_items     = this.$.list.find( 'a' );
            this.$.to_top         = this.$.main.find( 'a.to-top' );
            this.$.illustrations_container = this.$.main.find( '.illustrations-container' );
            this.$.illustrations           = this.$.main.find( '.illustrations' );
            this.$.illustrations_items     = this.$.illustrations_container.find( '.illustration' );

            this.wave          = {};
            this.wave.timeout  = null;
            this.wave.interval = null;

            this.$.illustrations_container.removeClass( 'hidden' );

            this.init_events();
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;

            // Illustrations mouse envets
            this.$.illustrations_container.on( 'click mouseenter mouseleave', function( e )
            {
                // Trigger click on current project
                var $project = that.$.projects.filter( '.current' );

                if( $project.length )
                {
                    switch( e.type )
                    {
                        case 'click' :
                            $project.find( 'a' ).trigger( 'click' );
                            break;
                        case 'mouseenter' :
                            $project.find( 'a' ).addClass( 'hover' );
                            break;
                        case 'mouseleave' :
                            $project.find( 'a' ).removeClass( 'hover' );
                            break;
                    }
                }

                return false;
            } );

            // Hover projects titles
            this.$.projects.each( function()
            {
                var $project = $( this ),
                    index    = $project.index();

                $project.find( '.left a' ).on( 'mouseenter mouseleave', function(e)
                {
                    if( e.type === 'mouseenter' )
                    {
                        that.$.illustrations_items.eq( index ).addClass( 'hover' );
                    }
                    else
                    {
                        that.$.illustrations_items.eq( index ).removeClass( 'hover' );
                    }
                } );
            } );

            // List items click
            this.$.list_items.on( 'click', function()
            {
                that.trigger( 'gotoline', [ $( this ).index() ] );
                return false;
            } );

            // To top click
            this.$.to_top.on( 'click', function()
            {
                that.trigger( 'gotoline', [ 0 ] );
                return false;
            } );

            // Orientation change event
            window.addEventListener( 'orientationchange', function()
            {
                var current = that.$.projects.filter( '.current' );

                if( !current.length )
                    return;

                var index = current.index(),
                    y     = - index * 100;

                that.$.illustrations.removeClass( 'animated' );
                window.setTimeout( function()
                {
                    that.$.illustrations.addClass( 'animated' );
                }, 100 ); // Why 100 ? What a question... U know Y !

                var match = that.browser.match_media('(max-width:900px)');

                that.$.illustrations.css( {
                    transform : match ? 'translateX( ' + y + '% ) translateZ(0)' : 'translateY( ' + y + '% ) translateZ(0)'
                } );

                that.$.illustrations_container.removeClass( 'hidden' );
            }, false );
        },

        /**
         * UPDATE LINE
         */
        update_line: function( index, count, direction )
        {
            var that = this;

            // Wave
            if( this.wave.timeout )
                window.clearTimeout( this.wave.timeout );

            if( this.wave.interval )
                window.clearInterval( this.wave.interval );

            if( index === 0 )
            {
                this.wave.count++;

                this.wave.timeout = window.setTimeout( function()
                {
                    that.play_wave();

                    that.wave.interval = window.setInterval( function()
                    {
                        that.play_wave();
                    }, 5000 );

                }, 2000 );
            }

            // Normal
            if( index < this.$.projects.length )
            {
                var y = - index * 100;

                if( this.updates_count === 0 )
                {
                    this.$.illustrations.removeClass( 'animated' );
                    window.setTimeout( function()
                    {
                        that.$.illustrations.addClass( 'animated' );
                    }, 100 ); // Why 100 ? What a question... U know Y !
                }

                var match = this.browser.match_media('(max-width:900px)');

                this.$.illustrations.css( {
                    transform : match ? 'translateX( ' + y + '% ) translateZ(0)' : 'translateY( ' + y + '% ) translateZ(0)'
                } );

                this.$.illustrations_container.removeClass( 'hidden' );
            }
            else
            {
                this.$.illustrations_container.addClass( 'hidden' );
            }

            // Update list
            this.$.list_items.removeClass( 'active' );
            this.$.list_items.eq( index ).addClass( 'active' );

            this.updates_count++;
        },

        /**
         * PLAY WAVE
         */
        play_wave: function()
        {
            var that = this;

            this.$.list.removeClass( 'wave' );

            window.setTimeout( function()
            {
                that.$.list.addClass( 'wave' );
            }, 30 );
        }
    });
})();




