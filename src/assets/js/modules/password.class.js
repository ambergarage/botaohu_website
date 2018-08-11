(function()
{
    'use strict';

    APP.COMPONENTS.Password = APP.CORE.Event_Emitter.extend(
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

            this.active = false;
            this.ajax   = null;
            this.saved  = {};

            this.saved.url       = null;
            this.saved.direction = null;

            this.$.main  = $( '.password' );
            this.$.close = this.$.main.find( '.close' );
            this.$.form  = this.$.main.find( 'form' );
            this.$.input = this.$.form.find( 'input[type=password]' );

            this.init_events();
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;

            // Close click event
            this.$.close.on( 'click', function()
            {
                if( that.saved.url )
                {
                    that.deactivate();
                }
                else
                {
                    that.trigger( 'ok', [ 'http://nicolas-bussiere.dev/', 'from-right' ] );
                    that.deactivate();
                }

                return false;
            } );

            // Form submit event
            this.$.form.on( 'submit', function()
            {
                if( that.ajax === null )
                {
                    that.ajax = $.ajax( {
                        url     : that.$.form.attr( 'action' ),
                        data    : that.$.form.serialize(),
                        type    : 'post',
                        success : function( res )
                        {
                            if( res === 'ok' )
                            {
                                that.trigger( 'ok', [ that.saved.url, that.saved.direction ] );
                                that.$.input.blur();
                                that.deactivate();
                            }
                            else
                            {
                                window.setTimeout( function()
                                {
                                    that.$.input.addClass( 'error' );
                                }, 200 );
                            }

                            that.ajax = null;
                        },
                        error : function(e)
                        {
                            that.ajax = null;
                            console.log('error');
                        }
                    } );
                }

                return false;
            } );

            // Input change
            this.$.input.on( 'keyup', function()
            {
                that.$.input.removeClass( 'error' );
            } );
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
        activate: function( url, direction )
        {
            var that = this;

            // Save url and direction
            this.saved.url       = url;
            this.saved.direction = direction;

            this.$.main.css( { display : 'block' } );

            this.timeout = window.setTimeout( function()
            {
                that.$.main.addClass( 'active' );
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

            this.active = false;

            this.$.main.removeClass( 'active' );

            this.timeout = window.setTimeout( function()
            {
                that.$.main.css( { display : 'none' } );
            }, 500 );

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




