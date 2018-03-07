var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');
var $ACTUALTABLE = $('.table');

//adds row
$('.table-add-row').click(function () {
  //clones the tr and removes the "hide" class from it so it is visible
  var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');

  var rowCounter = $('#firstTableRow td').length;
  for (var x = rowCounter-1; x > 0; x--)
  {
    console.log(x);
    //inserts new column into the cloned table row based on size in the right place
    $clone.find('td').eq(0).after('<td style = "text-align: center;" contenteditable="true" >undefined</td>');
  }
  //adds the table row
  $TABLE.find('table').append($clone);
});

//adds column
$('.table-add-column').click(function(){
  //finds the td, removes the hide class
var $clone = $TABLE.find('td.hide').clone(true).removeClass('hide');

//adds the cloned td as a column to the first row
$ACTUALTABLE.find('tr').eq(0).append($clone);
console.log($clone);

//goes through each row
$ACTUALTABLE.find('tr').each(function(){
var trow = $(this);
// trow.index is greater than 2 because it skips the first tr and also a tr that is hidden
if(trow.index() > 2)
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
   }
  })
  })



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
