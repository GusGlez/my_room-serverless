/**
 * Web application
 */
const apiUrl = 'https://b103f138.us-south.apigw.appdomain.cloud/my_room_api';
const guestbook = {
  // retrieve the existing guestbook entries
  get() {
    return $.ajax({
      type: 'GET',
      url: `${apiUrl}/get_data`,
      dataType: 'json'
    });
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
      $('#entries').html('Loading entries...');
      guestbook.get().done(function (result) {
        console.log(result.entries);
        if (!result.entries) {
          return;
        }

        const context = {
          entries: result.entries
        }
        $('#entries').html(entriesTemplate(context));
      }).error(function (error) {
        $('#entries').html('No entries');
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

