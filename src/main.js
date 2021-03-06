var searchBoxOpen = false;

var openSearchInputBox = function (objectClicked) {
    var siblingsOfObjectClicked = Array.prototype.slice.call(objectClicked.parentNode.childNodes);
    if (!searchBoxOpen) {
        for (var i=0; i<siblingsOfObjectClicked.length; i++) {
            var classListOfSibling = [];
            if (siblingsOfObjectClicked[i].classList != undefined) {
                classListOfSibling = Array.prototype.slice.call(siblingsOfObjectClicked[i].classList);
            }
            if (classListOfSibling != undefined && classListOfSibling.indexOf('searchboxcontainer') >= 0) {
                document.getElementById(siblingsOfObjectClicked[i].id).classList.add('open-search-box');
            }
            if (document.getElementById('searchText').value.length > 0) {
                document.getElementById('searchTextInsert').value = document.getElementById('searchText').value;
            }
        }

        searchBoxOpen = true;
    } else {
        for (var i=0; i<siblingsOfObjectClicked.length; i++) {
            var classListOfSibling = [];
            if (siblingsOfObjectClicked[i].classList != undefined) {
                classListOfSibling = Array.prototype.slice.call(siblingsOfObjectClicked[i].classList);
            }
            if (classListOfSibling != undefined && classListOfSibling.indexOf('open-search-box') >= 0) {
                document.getElementById(siblingsOfObjectClicked[i].id).classList.remove('open-search-box');
            }
        }
        searchBoxOpen = false;
    }
};
var activePageAndTabAndSideBarBtn = {
    'activeNavTab': null,
    'activeSideBarBtn': null,
    'activePageView': null
};

var navIsOpen = false;

function viewPage(idOfPageToView, idOfNavTabClicked, navigationId) {
    // view page and make tab active
    addClassById(idOfNavTabClicked, 'activeNavTab', 'active-nav');
    addClassById(idOfPageToView, 'activePageView', 'active-page-view');
    if (navIsOpen) {
        document.getElementById(navigationId).classList.remove('open-nav');
        navIsOpen = false;
    }
    document.querySelector('body').scrollTop = 0;
};

var addClassById = function (idOfElementClicked, lastActiveElement, classToAdd) {
    if (activePageAndTabAndSideBarBtn[lastActiveElement] != null) {
        document.getElementById(activePageAndTabAndSideBarBtn[lastActiveElement]).classList.remove(classToAdd);
    }
    document.getElementById(idOfElementClicked).classList.add(classToAdd);
    activePageAndTabAndSideBarBtn[lastActiveElement] = idOfElementClicked;
};

var openNav = function (navigationId) {
    if (navIsOpen) {
        document.getElementById(navigationId).classList.remove('open-nav');
        navIsOpen = false;
    } else {
        document.getElementById(navigationId).classList.add('open-nav');
        navIsOpen = true;
    }
};
var modulesToScrollTo = Array.prototype.slice.call(document.getElementsByClassName('side-nav-module'));

if (modulesToScrollTo.length > 0) {
    var sidebarModuleBtns = {
        'modulesOffsetTop': {},
        'modulesSideBarBtnsById': {}
    };
    var headerAndNavHeight = document.getElementById('navigation').offsetHeight + document.getElementById('header').offsetHeight;
    var allSideBarBtns = Array.prototype.slice.call(document.getElementsByClassName('side-bar-btn'));

    var findModulesOffsetTop = function () {
        var headerAndNavHeight = document.getElementById('navigation').offsetHeight + document.getElementById('header').offsetHeight;
        var allSideBarBtns = Array.prototype.slice.call(document.getElementsByClassName('side-bar-btn'));
        for (var i=0; i<modulesToScrollTo.length; i++) {
            var key = modulesToScrollTo[i].id;
            sidebarModuleBtns.modulesOffsetTop[key] = document.getElementById(key).offsetTop - 2*headerAndNavHeight;
            sidebarModuleBtns.modulesSideBarBtnsById[key] = allSideBarBtns[i];
        }
    };

    window.onscroll = function() {
        findModulesOffsetTop();
        for (var i=0; i<modulesToScrollTo.length; i++) {
            var key = modulesToScrollTo[i].id;
            if (sidebarModuleBtns.modulesOffsetTop[key] <= document.querySelector('body').scrollTop) {
                var idOfActiveSidebarBtn = sidebarModuleBtns.modulesSideBarBtnsById[key].id;
                activeSideBarButton(idOfActiveSidebarBtn)
            }
        }
    };

    var activeSideBarButton = function (buttonId) {
        //function found in navigation.js
        addClassById(buttonId, 'activeSideBarBtn','active-module')
    };

    activeSideBarButton('introSidebarBtn');
}

var smoothScrollTo = function(targetId, buttonId) {
    var element = document.querySelector('body');
    var target = document.getElementById(targetId).offsetTop - headerAndNavHeight;
    var duration = 600;

    target = Math.round(target);
    duration = Math.round(duration);

    if (duration < 0) {
        return Promise.reject("bad duration");
    }
    if (duration === 0) {
        element.scrollTop = target;
        return Promise.resolve();
    }

    var start_time = Date.now();
    var end_time = start_time + duration;
    var start_top = element.scrollTop;
    var distance = target - start_top;

    var smooth_step = function(start, end, point) {
        if(point <= start) { return 0; }
        if(point >= end) { return 1; }
        var x = (point - start) / (end - start); // interpolation
        return x*x*(3 - 2*x);
    }

    return new Promise(function(resolve, reject) {
        // This is to keep track of where the element's scrollTop is
        // supposed to be, based on what we're doing
        var previous_top = element.scrollTop;

        // This is like a think function from a game loop
        var scroll_frame = function() {
            if(element.scrollTop != previous_top) {
                reject("interrupted");
                return;
            }

            // set the scrollTop for this frame
            var now = Date.now();
            var point = smooth_step(start_time, end_time, now);
            var frameTop = Math.round(start_top + (distance * point));
            element.scrollTop = frameTop;

            // check if we're done!
            if(now >= end_time) {
                resolve();
                return;
            }

            // If we were supposed to scroll but didn't, then we
            // probably hit the limit, so consider it done; not
            // interrupted.
            if(element.scrollTop === previous_top
                && element.scrollTop !== frameTop) {
                resolve();
                return;
            }
            previous_top = element.scrollTop;

            // schedule next frame for execution
            setTimeout(scroll_frame, 0);
        }

        // boostrap the animation process
        setTimeout(scroll_frame, 0);
    });
};


var openVideoLightbox = function(videoContainerOpen, object) {
    console.log(videoContainerOpen, object);

    if (!videoContainerOpen) {
        document.getElementById('videoContainer').classList.add('open-video-container');
    } else {
        document.getElementById('videoContainer').classList.remove('open-video-container');
    }
};