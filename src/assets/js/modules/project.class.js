(function()
{
    'use strict';

    APP.COMPONENTS.Project = APP.CORE.Event_Emitter.extend(
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

            this.browser = new APP.TOOLS.Browser();
            this.type    = 'project';
            this.active  = true;

            this.$.main          = $( '.page.project' );
            this.$.links         = this.$.main.find( '.links' );
            this.$.to_top        = this.$.links.find( '.to-top' );
            this.$.to_down       = this.$.main.find( '.intro .arrow' );
            this.$.lines         = this.$.main.find( '.line' );
            this.$.lines_resize  = this.$.lines.not( '.line-to-screen-size' );
            // this.$.illustrations = this.$.lines.find( '.illustration' );
            // this.$.illustrations.last().addClass( 'last' );
            
            this.init_pagination();
            this.resize();
            this.init_events();
        },

        /**
         * INIT PAGINATION
         */
        init_pagination: function()
        {
            var that = this;
    
            this.pagination             = { $: {} };
            this.pagination.$.container = this.$.main.find( '.pagination' );
            this.pagination.$.current   = this.pagination.$.container.find( '.current' );
            this.pagination.$.total     = this.pagination.$.container.find( '.total' );
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;

            // To top click
            this.$.to_top.on( 'click', function()
            {
                that.trigger( 'gotoline', [ 0 ] );
                return false;
            } );

            // To down click
            this.$.to_down.on( 'click', function()
            {
                that.trigger( 'gotoline', [ 1 ] );
                return false;
            } );

            // Browser resize
            this.browser.on( 'resize', function()
            {
                that.resize();
            } );
        },

        /**
         * RESIZE
         */
        resize: function()
        {
            if( this.browser.width < 900 )
            {
                var container_width = this.$.main.width(),
                    width           = container_width,
                    height          = width / 1.8 + 120;

                this.$.lines_resize.css( {
                    height    : Math.round( height ),
                    top       : '50%',
                    marginTop : Math.round( - height / 2 )
                } );
            }

            else
            {
                this.$.lines_resize.css( {
                    height    : '100%',
                    top       : 0,
                    marginTop : 0
                } );
            }
        },

        /**
         * UPDATE LINE
         */
        update_line: function( index, count, direction )
        {
            // To top
            if( index > 0 )
                this.$.to_top.removeClass( 'hidden' );
            else
                this.$.to_top.addClass( 'hidden' );

            // // Links
            // if( index === count - 1 )
            //     this.$.links.addClass( 'hidden' );
            // else
            //     this.$.links.removeClass( 'hidden' );

            this.pagination.$.current.text( index + 1 );
            this.pagination.$.total.text( count );
        }
    });
})();




