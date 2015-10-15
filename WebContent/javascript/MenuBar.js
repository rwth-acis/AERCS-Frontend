var menuString = 
        '\
            <div style="position:absolute;left:50%;margin-left:-635px;z-index:2;padding-left:5px;">\
                <a href="http://dbis.rwth-aachen.de/cms/research/ACIS" target="_blank"><img alt="ACIS" src="img/acis_logo.png"></a>\
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
                                 <a href="SeriesComparison.html" id="global_friends_link">Compare Series</a>\
                            </div>\
                        </li>\
                    </ul>\
                    <form method="get" action="SearchResult.html" name="qsearch" id="qsearchform" >\
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
			<div class="loader"></div>\
        ';

function appendMenu(element){
    $(element).prepend(menuString);
}