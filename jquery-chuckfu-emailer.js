(function( $ ) {

    $.fn.chuckFuEmailer = function( options ) {

        // default settings
        var defaults = {
            toSelector: '.email.email-to',
            toAllSelector: '.email.email-to-all',
            toTesterIndicatorSelector: '.email.email-is-tester',
            toTesterAddressSelector: '.email.email-tester-address',
            selectTextSelector: '.chuckfu-selected-text',
            selectedQtySelector: '.chuckfu-selected-qty',
            selectedText: $('<span class="chuckfu-selected-text"/>').html('Applicants selected to receive email:&nbsp;'),
            selectedQty: $('<span class="chuckfu-selected-qty"/>').html('-'),
            onSendEmail: function() {},
            postToUrl: false,
            composeUrl: false
        };

        var settings = $.extend({}, defaults, options);

        var to = $(settings.toSelector);
        var toAll = $(settings.toAllSelector);

        $.fn.updateSelectedToQty = function() {
            var mcount = $(settings.toSelector + ':checked').length;
            var target = $(settings.selectedQtySelector);

            $(settings.selectedQtySelector).html(mcount);

            return true;
        }

        $.fn.sendEmailButton = function() {
            var ebtn = $('<button/>',{
                class: 'chuckfu-sendemail-btn btn btn-success',
                type: 'button'
            }).html('<i class="fa fa-envelope"></i> Send Email');
            return ebtn;
        }

        $.fn.toggleCheckAll = function() {
            var toBoxes = $(settings.toSelector);
            toBoxes.prop("checked", !toBoxes.prop("checked")).updateSelectedToQty();
        }

        $.fn.sendEmail = function() {

            //var settings = $.extend({}, defaults, options);
            var to = $(settings.toSelector + ':checked');

            if (to.length) {

                if ( settings.postToUrl ) {
                    $.ajaxPost(location, to)
                }

                if (settings.composeUrl) {
                    $.redirectPost(settings.composeUrl, to);
                }


            }
            else {
                alert('You must select an applicant before you can send an email!');
            }

            settings.onSendEmail.call();

        };


        $.extend(
        {
            redirectPost: function(location, args)
            {

                var form = '';
                $.each( args, function( key, value ) {
                    form += '<input type="hidden" name="'+ value.name +'" value="'+ value.value +'">';
                });
                $('<form action="'+location+'" method="POST">'+form+'</form>').appendTo('body').submit();
            },
            ajaxPost: function(location, args)
            {
                var data = args.serialize();

                $.post(
                    location,
                    data
                )
                .done(function(rdata) {

                    to.each(function() {
                        $(this).prop('checked',false);
                    });

                });
            }
        });

        var countSelected = function() {
            var msg = $('<div/>').html(settings.selectedText);
            msg.append(settings.selectedQty);

            return msg;
        }

        $(this).before(countSelected).updateSelectedToQty();
        $(this).before($.fn.sendEmailButton());

        return this.each(function() {
            var btnSendMail = $('.chuckfu-sendemail-btn');

            btnSendMail.on("click.chuckFuSendEmail", function(evt) {
                 evt.preventDefault();
                 $.fn.sendEmail();
            })

            to.on("click.chuckFuTo", function(evt) {
                $.fn.updateSelectedToQty();
            });

            toAll.on("click.chuckFuToAll", function(evt) {
                $.fn.toggleCheckAll();
            });




        });

    };


}( jQuery ));
