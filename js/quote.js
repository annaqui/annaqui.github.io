
//1. User Story: I can click a button to show me a new random quote.

//Retrieve Quote and Author from API
//Insert quote into the span with id #quote
//Insert author into paragraph with id #attributed

//2. User Story: I can press a button to tweet out a quote.
//Append Tweet URL in anchor with id #tweetit with quote and author:  'https://twitter.com/intent/tweet' + quote +  " - "  + author


/*'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1'


[{
	"ID":1762,
	"title":"R. Klanten, H. Hellige",
	"content":"<p>Today\u2019s designers and illustrators are synthesizing the best elements from past eras of graphic design to create a new visual language with a reduced and rational approach.<\/p>\n",
	"link":"https:\/\/quotesondesign.com\/r-klanten-h-hellige\/",
	"custom_meta":{"Source":"<a href=\"https:\/\/shop.gestalten.com\/index.php\/catalog\/product\/view\/id\/4015#moreinfo\">Book Description<\/a>"}
}] */

 $(document).ready(function() {
 	 $("#getQuote").on("click", function(){
 	 	$.getJSON("https://crossorigin.me/http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=", function(a) {
 	 	$("#quote").append(a[0].content + "<p>&mdash; " + a[0].title + "</p>")
		});
 	});
 });