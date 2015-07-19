var footerString = '\
    <div id="pagefooter">\
	    <div class="pagefooter_topborder clearfix">\
	        <center>Provided by Manh Cuong Pham, RWTH Aachen University, Dept. of Databases and Information Systems <br />\
	            <a href="index.html">Home</a> &middot; <a href="mailto:pham@dbis.rwth-aachen.de">Contact</a> &middot; <a href="http://www-i5.informatik.rwth-aachen.de/">Dept. of Information Systems, RWTH Aachen</a> &middot; <a href="index.html">Information</a> &middot; <a href="http://dblp.uni-trier.de">DBLP</a>\
	        </center>\
	    </div>\
	</div>';

function appendFooter(element){
    $(element).append(footerString);
}