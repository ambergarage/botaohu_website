(function()
{
    'use strict';

    APP.CORE.App = APP.CORE.Abstract.extend(
    {
        options:
        {
            page : 'home'
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.page         = null;
            this.can_navigate = true;
            this.ticker       = new APP.TOOLS.Ticker();
            this.browser      = new APP.TOOLS.Browser( { initial_triggers : [ 'resize' ] } );
            this.css          = new APP.TOOLS.Css();
            this.mouse        = new APP.TOOLS.Mouse();
            this.keyboard     = new APP.TOOLS.Keyboard();
            this.navigation   = new APP.TOOLS.Navigation();

            this.$.title = $( 'head title' );

            this.init_password();
            this.init_page( this.options.page );
            this.init_ajax();
            this.init_columns();
            this.init_lines();
            this.init_header();
            this.init_keyboard();
            this.init_hammer();
            this.update_images();
        },

        /**
         * START
         */
        start: function()
        {
            var that = this;

            this.browser.start();
            this.ticker.start( true );
        },

        /**
         * INIT HAMMER
         */
        init_hammer: function()
        {
            var that = this;

            var hammertime = new Hammer( document.body );
            hammertime.on( 'swipe', function( e )
            {
                var index = that.index;

                // Home
                if( that.page.type === 'home' )
                {
                    // Right
                    if(
                        ( ( window.orientation === 0 || window.orientation === 180 ) && e.direction === Hammer.DIRECTION_RIGHT ) ||
                        ( ( window.orientation === -90 || window.orientation === 90 ) && e.direction === Hammer.DIRECTION_DOWN )
                    )
                    {
                        that.go_to_line( index - 1 );
                    }

                    // Left
                    else if(
                        ( ( window.orientation === 0 || window.orientation === 180 ) && e.direction === Hammer.DIRECTION_LEFT ) ||
                        ( ( window.orientation === -90 || window.orientation === 90 ) && e.direction === Hammer.DIRECTION_UP )
                    )
                    {
                        that.go_to_line( index + 1 );
                    }
                }

                // Project
                else if( that.page.type === 'project' )
                {
                    // Up
                    if( e.direction === Hammer.DIRECTION_UP )
                    {
                        that.go_to_line( index + 1 );
                    }

                    // DOWN
                    else if( e.direction === Hammer.DIRECTION_DOWN )
                    {
                        that.go_to_line( index - 1 );
                    }
                }
            } );

            this.browser.on( 'breakpoint', function( current_breakpoint, previous_breakpoint )
            {
                if( current_breakpoint.name === 'small' )
                    hammertime.get( 'swipe' ).set( { direction : Hammer.DIRECTION_ALL, enable : false } );
                else
                    hammertime.get( 'swipe' ).set( { direction : Hammer.DIRECTION_ALL } );
            } );
        },

        /**
         * INIT KEYBOARD
         */
        init_keyboard: function()
        {
            var that = this;

            this.keyboard.on( 'down', function( code, character )
            {
                switch( character )
                {
                    case 'down' :
                    case 'j' :
                        that.go_to_line( that.index + 1 );
                        break;

                    case 'esc' :
                        // Close menu
                        if( that.header.active )
                            that.header.deactivate();

                        // Close project
                        else if( that.page.type === 'project' )
                            that.page.$.main.find( 'a.close' ).first().trigger( 'click' );

                        break;

                    case 'up' :
                    case 'k' :
                        that.go_to_line( that.index - 1 );
                        break;

                    case 'space' :
                    case 'enter' :
                    case 'right' :

                        if( that.can_navigate && that.page.type === 'home' && !that.password.active )
                        {
                            var $line = that.$.lines.filter( '.current' );

                            if( $line.length && $line.hasClass( 'project' ) )
                            {
                                $line.find( 'a' ).first().trigger( 'click' );
                            }

                        }
                        break;

                    case 'left' :

                        if( that.can_navigate && that.page.type === 'project' )
                        {
                            that.page.$.main.find( 'a.close' ).first().trigger( 'click' );
                        }

                        break;
                }

                if( [ 'down', 'j', 'esc', 'up', 'k', 'space', 'right', 'left' ].indexOf( character ) !== -1 || ( character === 'enter' && !that.password.active ) )
                    return false;
            } );
        },

        /**
         * INIT PAGE
         */
        init_page: function( page_name )
        {
            var that = this,
                page = null;

            switch( page_name )
            {
                case 'home':
                    page = new APP.COMPONENTS.Home();
                    break;

                case 'project':
                    page = new APP.COMPONENTS.Project();
                    break;

                case 'availabilities':
                    $( 'body' ).addClass( 'dark' );
                    break;

                case 'password':
                    this.password.activate();
                    break;
            }


            // Events
            if( page )
            {
                page.on( 'gotoline', function( index )
                {
                    that.go_to_line( index );
                } );
            }

            // New page
            if( this.page )
            {
                // Tracking
                // if( ga )
                //     ga( 'send', 'pageview' );
            }

            this.page = page;

            // Fast click
            FastClick.attach( document.body );
        },

        /**
         * INIT PASSWORD
         */
        init_password: function()
        {
            var that = this;

            this.password = new APP.COMPONENTS.Password();

            this.password.on( 'ok', function( url, direction )
            {
                url       = url       || window.location;
                direction = direction || 'from-right';

                that.load( url, direction );
            } );
        },

        /**
         * INIT HEADER
         */
        init_header: function()
        {
            var that = this;

            this.header = new APP.COMPONENTS.Header();

            // Header project link click
            this.header.on( 'project-click', function( url, direction )
            {
                that.load( url, direction );
            } );

            // Header activate
            this.header.on( 'activate', function()
            {
                that.can_scroll = false;
            } );

            // Header deactivate
            this.header.on( 'deactivate', function()
            {
                that.can_scroll = true;
            } );
        },

        /**
         * INIT AJAX
         */
        init_ajax: function( $container )
        {
            var that = this;

            this.ajax          = {};
            this.ajax.$links   = $();
            this.ajax.instance = null;

            this.update_ajax();

            that.navigation.on( 'pop', function( state, url, direction )
            {
                // Load and force because url = window.location.href
                that.load( url, state.direction === 'backward' ? 'from-left' : 'from-right', true );
            } );
        },

        /**
         * UPDATE AJAX
         */
        update_ajax: function( $container )
        {
            var that = this;
            $container = $container || $( 'body' );

            // Remove previous event listener
            this.ajax.$links.off('click.ajax');

            // Find ajax links
            this.ajax.$links = $container.find( 'a.ajax' );

            // Ajax links click event
            this.ajax.$links.on( 'click.ajax', function()
            {
                // test if ajax already running
                if( !that.ajax.instance )
                {
                    var $link = $( this );
                    that.load( $link.attr( 'href' ), $link.data( 'direction' ) );
                }

                return false;
            } );
        },

        /**
         * UPDATE IMAGES
         */
        update_images: function( $container )
        {
            var that = this;
            $container = $container || $( 'body' );

            var $images_to_load = $container.find( '.to-load:not(.loaded)' );

            $images_to_load.each( function()
            {
                var $image_to_load = $( this ),
                    $image         = $( '<span />' ),
                    url            = $image_to_load.data( 'image-url' ),
                    image          = new Image();

                $image_to_load.append( $image );

                image.onload = function()
                {
                    window.setTimeout(function()
                    {
                        $image.css( {
                            backgroundImage : 'url(' + url + ')'
                        } );
                        $image_to_load.addClass( 'loaded' );

                    }, 30 /* + Math.random() * 5000 */ );
                };
                image.src = url;
            } );
        },

        /**
         * LOAD
         */
        load: function( url, direction, from_pop )
        {
            var that = this;

            // Close menu
            if( this.header.active )
                this.header.deactivate();

            if( url === window.location.href && !from_pop )
            {
                if( this.page.type === 'home' || this.page.type === 'project' )
                {
                    this.go_to_line( 0 );
                }

                return false;
            }

            // Prevent navigation
            this.can_navigate = false;

            // Default
            direction = direction || 'from-right';

            // Prepare columns
            var $column = $( '<div class="column">' );
            $column.css( { left : direction === 'from-right' ? '100%' : '-100%' } );

            // Ajax call
            var ajax_promise = Q.defer();
            if (url.indexOf(document.location.origin) < 0) {
              url = document.location.origin + url;
            }
            this.ajax.instance = $.ajax( {
                url     : url,
                success : function( res )
                {
                    that.ajax.instance = null;
                    ajax_promise.resolve( res );
                },
                error : function( res )
                {
                    that.ajax.instance = null;

                    if( res.status === 403 )
                    {
                        that.password.activate( url, direction );
                    }

                    ajax_promise.resolve( 'error' );
                }
            } );

            // Animation and loaded over
            Q.allSettled( [
                ajax_promise.promise,
                // animation_promise.promise
            ] ).then( function( res )
            {
                res = res[ 0 ].value;

                if( res !== 'error' )
                {
                    that.$.columns.addClass( 'animated' );

                    // Wait a frame
                    window.setTimeout( function()
                    {
                        res = jQuery(jQuery.parseHTML(res)).find('div.page');

                        // Set column
                        $column.append( res.clone() );
                        that.$.columns.append( $column );

                        // Update ajax
                        that.update_ajax();

                        // Update images
                        that.update_images( $column );

                        // Deactivate page
                        if( that.page )
                            that.page.active = false;

                        // Navigation push
                        var title = $column.find( 'input[type=text].title' ).val();
                        document.title = title;
                        if( !from_pop )
                            that.navigation.push( { title : title }, url );

                        // Init page
                        var page = $column.find( 'input[type=text].page' ).val();
                        that.init_page( page );

                        // Update lines
                        that.$.lines = $column.find( '.line' );

                        // Specified hashtag
                        if( window.location.hash )
                        {
                            var $line = that.$.lines.filter( '.line-' + ( window.location.hash.replace( '#', '' ) ) );

                            if( $line.length )
                            {
                                var index = $line.index();
                                window.location.hash = '';
                                that.go_to_line( index );
                            }
                        }

                        // No hashtag
                        else
                        {
                            that.go_to_line( from_pop && that.navigation.history.state.line ? that.navigation.history.state.line : 0 );
                        }


                        // Animate columns
                        that.$.columns.css( {
                            transform : 'translateX( ' + ( direction === 'from-right' ? '-100%' : '100%' ) + ' ) translateZ(0)'
                        } );

                        // Wait animation end
                        window.setTimeout( function()
                        {
                            // Reset columns positions
                            that.$.columns.removeClass( 'animated' );
                            that.$.columns.css( {
                                transform : 'translateX( 0 ) translateZ(0)'
                            } );
                            $column.css( { left : 0 } );

                            // Remove old column
                            that.$.columns.find( '.column' ).not( $column ).remove();

                            // Allow navigation
                            that.can_navigate = true;

                        }, 1050 );
                    }, 30 );
                }
                else
                {
                    console.log( 'error' );
                }
            } );

            // Promises
        },

        /**
         * INIT COLUMNS
         */
        init_columns: function()
        {
            this.$.columns = $( '.columns' );
        },

        /**
         * INIT LINES
         */
        init_lines: function()
        {
            var that = this;

            this.can_scroll = true;
            this.$.lines    = $( '.line' );
            this.index      = 0;

            if( window.location.hash )
            {
                var $line = this.$.lines.filter( '.line-' + ( window.location.hash.replace( '#', '' ) ) );

                if( $line.length )
                {
                    this.index = $line.index();
                    window.location.hash = '';
                }
            }

            this.go_to_line( this.index, 30 );

            // Wheel
            this.mouse.on( 'wheel', function( delta )
            {
                // Set variables
                var index = that.index + ( delta < 0 ? 1 : -1 );

                that.go_to_line( index );

                // if( that.browser.width >= 900 )
                // {
                //     return false;
                // }
            } );
        },

        go_to_line: function( index, duration )
        {
            duration = duration || 1060;

            // // Prevent on project when width < 900
            // if( this.browser.width < 900 )
            // {
            //     if( this.page.type === 'project' )
            //     {
            //         this.$.lines.removeClass( 'before current after going-down going-up' );
            //         this.$.lines.addClass( 'current going-up' );
            //         return;
            //     }
            // }

            // Cannot scroll
            if( !this.can_scroll || index < 0 || index > this.$.lines.length - 1 )
            {
                return;
            }

            var that      = this,
                direction = that.index < index ? 'down' : 'up';

            // Save in history state
            this.navigation.update_state( { line : index } );

            // Prevent scroll
            this.can_scroll = false;

            // Show all lines
            this.$.lines.show();

            // Wait a frame (RAF not working)
            window.setTimeout( function()
            {
                // Update classes
                that.$.lines.removeClass( 'before current after going-down going-up' );
                var i = 0;
                that.$.lines.each( function()
                {
                    var $line   = $( this ),
                        classes = null;

                    if( i < index )
                    {
                        classes = 'before';
                    }
                    else if( i > index )
                    {
                        classes = 'after';
                    }
                    else
                    {
                        classes = 'current';

                        if( $line.hasClass( 'dark' ) )
                            $( 'body' ).addClass( 'dark' );
                        else
                            $( 'body' ).removeClass( 'dark' );
                    }

                    classes += direction === 'down' ? ' going-up' : ' going-down';

                    $line.addClass( classes );

                    i++;
                } );

                // Wait before enabling scroll
                window.setTimeout( function()
                {
                    // Hide not currents lines
                    that.$.lines.filter( ':not(.current)' ).hide();

                    that.can_scroll = true;
                }, duration );

                // Update in page
                if( that.page && that.page.active )
                    that.page.update_line( index, that.$.lines.length, direction );

                // Save new index
                that.index = index;
            }, 60 );
        }
    });
})();
