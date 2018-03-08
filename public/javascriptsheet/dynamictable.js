
var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');
var $ACTUALTABLE = $('.table');

//adds row
$('.table-add-row').click(function () {
  //clones the tr and removes the "hide" class from it so it is visible
  var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');

  var rowCounter = $('#firstTableRow th').length;
  for (var x = rowCounter-1; x > 0; x--)
  {
    console.log(x);
    //inserts new column into the cloned table row based on size in the right place
    if(x == rowCounter-1)
    {
      $clone.find('td').eq(0).before('<td style = "text-align: center;" contenteditable="true" ><b>Attribute 1 </b></td>');
    }
    else
    $clone.find('td').eq(0).after('<td style = "text-align: center;" contenteditable="true" >undefined</td>');
  }
  //adds the table row
  $TABLE.find('table').append($clone);
});

//adds column
$('.table-add-column').click(function(){
  //finds the td, removes the hide class
var $clone = $TABLE.find('th.hide').clone(true).removeClass('hide');

//adds the cloned td as a column to the first row
$($ACTUALTABLE.find('tr').eq(0).find('th').eq(0)).after($clone);
console.log($clone);

//goes through each row
$ACTUALTABLE.find('tr').each(function(){
var trow = $(this);
// trow.index is greater than 2 because it skips the first tr and also a tr that is hidden
if(trow.index() > 0)
{
  //inserts the new column
  trow.find('td').eq(0).after('<td style = "text-align: center;" contenteditable="true" >undefined</td>');
}
})
})


$('.table-delete-column').click(function(){
 $ACTUALTABLE.find('tr').each(function(){
   var trow = $(this);
   //deletes from all table rows that do not have the 'hidden' class
   if(!trow.hasClass("hide") )
   {
     //another condition has to be met in order for something to be deleted
     if(!trow.find('td').eq(1).hasClass('no-delete'))
     trow.find('td').eq(1).remove();
     if(!trow.find('th').eq(1).hasClass('no-delete'))
     trow.find('th').eq(1).remove();
   }
  })
  })
  function fnExcelReport()
  {
      var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
      var textRange; var j=0;
      tab = document.getElementById('myTable'); // id of table
      for(j = 0 ; j < tab.rows.length ; j++)
      {
        if(j != (tab.rows.length -1) && j!= 1)
        {
          tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
          //replacing the unwanted columns in the excel chart
          tab_text = tab_text.replace(/<td class="no-delete"><span class="table-remove glyphicon glyphicon-remove" style="margin-left: 5%;"><\/span><\/td>/g,'');
          tab_text = tab_text.replace(/<td class="no-delete"><span class="table-up glyphicon glyphicon-arrow-up" style="margin-left: 5%;"><\/span><span class="table-down glyphicon glyphicon-arrow-down" style="margin-left: 5%;"><\/span><\/td>/g, '');
          //tab_text=tab_text+"</tr>";
        }
      }
      console.log(tab_text);
      tab_text=tab_text+"</table>";
      tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
      tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
      tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

      var ua = window.navigator.userAgent;
      var msie = ua.indexOf("MSIE ");

      if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
      {
          txtArea1.document.open("txt/html","replace");
          txtArea1.document.write(tab_text);
          txtArea1.document.close();
          txtArea1.focus();
          sa=txtArea1.document.execCommand("SaveAs",true,"Say Thanks to Sumit.xls");
      }
      else                 //other browser not tested on IE 11
          sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

      return (sa);
  }


$('.table-remove').click(function () {
  $(this).parents('tr').detach();
});



$('.table-up').click(function () {
  var $row = $(this).parents('tr');
  if ($row.index() === 1) return; // Don't go above the header
  $row.prev().before($row.get(0));
});

$('.table-down').click(function () {
  var $row = $(this).parents('tr');
  $row.next().after($row.get(0));
});

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN.click(function () {
  var $rows = $TABLE.find('tr:not(:hidden)');
  var headers = [];
  var data = [];

  // Get the headers (add special header logic here)
  $($rows.shift()).find('th:not(:empty)').each(function () {
    headers.push($(this).text().toLowerCase());
  });

  // Turn all existing rows into a loopable array
  $rows.each(function () {
    var $td = $(this).find('td');
    var h = {};

    // Use the headers from earlier to name our hash keys
    headers.forEach(function (header, i) {
      h[header] = $td.eq(i).text();
    });

    data.push(h);
  });

  // Output the result
  $EXPORT.text(JSON.stringify(data));
});
