var menuString = 
        '\
            <div style="position:absolute;left:50%;margin-left:-635px;z-index:2;">\
                <a href="http://www-i4.informatik.rwth-aachen.de/Kolleg/index.html" target="_blank"><img alt="Graduiertenkolleg" src="img/gk_banner.jpg"></a>\
            </div>\
            <div id="widebar" class="clearfix">\
                <div id="navigator">\
                    <ul class="main_set" id="nav_unused_1">\
                        <li>\
                            <div class="with_arrow">\
                                <a href="ConferenceList.html" id="global_friends_link">Conferences Browsing</a>\
                                <a href="JournalList.html" id="global_friends_link">Journals Browsing</a>\
                                <a href="Networks.html" id="global_friends_link">Networks</a>\
                                <a href="Rankings.html" id="global_friends_link">Rankings</a>\
                                 <!--a href="test-SeriesSelection1.jsp" id="global_friends_link">1</a-->\
                                 <a href="selectSeriesComparison.jsp" id="global_friends_link">Compare Series</a>\
                            </div>\
                        </li>\
                    </ul>\
                    <form method="post" action="searchservlet" name="qsearch" id="qsearchform" >\
                    <ul class="secondary_set" id="nav_unused_2">\
                        <li><b><font color="lightblue">Search</font></b></li>\
                        <li>\
                            <input id="q" class="inputtext typeahead_placeholder" name="searchdata" type="text" results="0" autosave="" value="" maxlength="100" size="25" autocomplete="off"/>\
                        </li>\
                        <li>\
                            <select id = "q" name="searchfield" title="Search field">\
                                <option value="1"> Person </option>\
                                <option value="2"> Event </option>\
                                <option value = "3"> Series </option>\
                            </select>\
                        </li>\
                        <li>\
                            <input type="submit" name="submit" value="Search"> <!-- class ="inputsubmit"!-->\
                        </li>\
                    </ul>\
                    </form>\
                </div>\
            </div>\
        ';

function appendMenu(element){
    $(element).prepend(menuString);
}