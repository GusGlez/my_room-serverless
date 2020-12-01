/**
 * Web application
 */
const apiUrl = 'https://b103f138.us-south.apigw.appdomain.cloud/my_room_api';
const guestbook = {
  // retrieve the existing guestbook entries
  get() {
    console.log(`${apiUrl}/get_data`);
    var result = {};
    $.ajax({
      type: 'GET',
      url: `${apiUrl}/get_data`,
      dataType: 'json',
      success: function(data) {
        //line added to save ajax response in var result
        result = data;
    },
    });
    return result;
  }
};


  (function() {

    let entriesTemplate;

    function prepareTemplates() {
      entriesTemplate = Handlebars.compile($('#entries-template').html());
    }

    // retrieve entries and update the UI
     function loadEntries() {
      console.log('Cargando historial...');
      $('#entries').html('Cargando historial...');
       guestbook.get().done(function (result) {
        console.log(result);
        if (!result.entries) {
          $('#entries').html('No hay datos');
          return;
        }

        const context = {
          entries: result.entries
        }
        $('#entries').html(entriesTemplate(context));
      }).error(function (error) {
        $('#entries').html('No hay data');
        console.log(error);
      });
    }

    // intercept the click on the submit button, add the guestbook entry and
    // reload entries on success
    $(document).on('submit', '#addEntry', function (e) {
      e.preventDefault();

      guestbook.add(
        $('#name').val().trim(),
        $('#email').val().trim(),
        $('#comment').val().trim()
      ).done(function (result) {
        // reload entries
        loadEntries();
      }).error(function (error) {
        console.log(error);
      });
    });

    $(document).ready(function () {
      prepareTemplates();
      loadEntries();
    });
  })();

