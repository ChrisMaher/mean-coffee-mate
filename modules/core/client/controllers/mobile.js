/**
 * Created by Chris on 10/04/2016.
 */

"use strict";

var isMobile = {

    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }

};


if ( isMobile.Android() ) {
    document.location.href = "https://play.google.com/store/apps/details?id=coffeemate.chris.app.coffeemateclub";
}
else if(isMobile.iOS())
{
    document.location.href = "https://itunes.apple.com/us/app/coffeemate.club/id1101814054?ls=1&mt=8";
}
else if(isMobile.BlackBerry())
{
    document.location.href = "https://www.microsoft.com/en-gb/store/apps/coffeemate/9nblggh4m5b1";
}else if(isMobile.Windows())
{
    document.location.href = "https://www.microsoft.com/en-gb/store/apps/coffeemate/9nblggh4m5b1";
}
