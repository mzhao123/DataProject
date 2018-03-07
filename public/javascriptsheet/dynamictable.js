var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');
var $ACTUALTABLE = $('.table');


$('.table-add-row').click(function () {
  var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');

  var rowCounter = $('#firstTableRow td').length;
  for (var x = rowCounter-1; x > 0; x--)
  {
    console.log(x);
    //inserts new category in right place
    $clone.find('td').eq(0).after('<td style = "text-align: center;" contenteditable="true" >undefined</td>');
  }
  $TABLE.find('table').append($clone);
});


$('.table-add-column').click(function(){
  console.log("hi");
var $clone = $TABLE.find('td.hide').clone(true).removeClass('hide');

$ACTUALTABLE.find('tr').eq(0).append($clone);
console.log($clone);
$ACTUALTABLE.find('tr').each(function(){
var trow = $(this);
if(trow.index() > 2)
{
  trow.find('td').eq(0).after('<td style = "text-align: center;" contenteditable="true" >undefined</td>');
}
})
})


$('.table-delete-column').click(function(){
 $ACTUALTABLE.find('tr').each(function(){
   var trow = $(this);
   if(!trow.hasClass("hide") )
   {
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
