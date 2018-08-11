(function()
{
    "use strict";

    APP.TOOLS.Navigation = APP.CORE.Event_Emitter.extend(
    {
        options :
        {

        },

        /**
         * SINGLETON
         */
        staticInstantiate:function()
        {
            if( APP.TOOLS.Navigation.prototype.instance === null )
                return null;
            else
                return APP.TOOLS.Navigation.prototype.instance;
        },

        /**
         * INIT
         */
        init: function( options )
        {
            this._super(options);

            this.history  = history.pushState ? window.history : false;
            this.state_id = 0;

            // Support
            if( this.history )
            {
                // Save title in current state
                this.update_state( { _prevent_default_tag : 1, title : document.title, id : this.state_id } );
            }

            this.init_events();

            APP.TOOLS.Navigation.prototype.instance = this;
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            // Support
            if( !this.history )
                return;

            // Context
            var that = this;

            window.onpopstate = function( e )
            {
                // Create result object
                var result = Object.create( e.state );

                // Prevent initial pop
                if( !result._prevent_default_tag )
                    return;

                // Set title
                if( result.title )
                    document.title = result.title;

                // State direction
                result.direction = result.id < that.state_id ? 'backward' : 'frontward';
                that.state_id    = result.id;

                // Trigger
                that.trigger( 'pop', [ result, window.location.href, ] );
            };
        },

        /**
         * SET IN STATE
         */
        update_state: function( data, replace_state )
        {
            // Support
            if( !this.history )
                return;

            // Tag
            data._prevent_default_tag = 1;

            // Replace the complete state or state not existing yet
            if( replace_state || !this.history.state )
            {
                this.history.replaceState( data, document.title, window.location.href );

                try
                {
                    this.history.state = data;
                }
                catch( error )
                {
                    console.log( 'catch' );
                }
            }

            // Add each value to current state
            else
            {
                for( var key in data )
                {
                    try
                    {
                        this.history.state[ key ] = data[ key ];
                    }
                    catch( error )
                    {
                        console.log( 'catch' );
                    }
                }

                this.history.replaceState( this.history.state, document.title, window.location.href );
            }
        },

        /**
         * PUSH
         */
        push: function( state, url )
        {
            // Support
            if( !this.history )
                return;

            // Set title
            if( state.title )
                document.title = state.title;

            // State ID
            state.id = ++this.state_id;

            // Tag
            state.tag = 'test';

            // Push state into history
            this.history.pushState( state, state.title, url );

            this.trigger( 'push', [ state, url ] );
        }
    });
})();
