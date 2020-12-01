/**
 * Web application
 */
const apiUrl = 'https://b103f138.us-south.apigw.appdomain.cloud/my_room_api';
const guestbook = {
  // retrieve the existing guestbook entries
  get() {
    console.log(`${apiUrl}/get_data`);

    return $.ajax({
      type: 'GET',
      url: `${apiUrl}/get_data`,
      dataType: 'json',
    });

  }
};

(function () {

  let entriesTemplate;

  function prepareTemplates() {
    entriesTemplate = Handlebars.compile($('#entries-template').html());
  }

  // retrieve entries and update the UI
  async function loadEntries() {
    console.log('Cargando historial...');
    $('#entries').html('Cargando historial...');


    try {
      var result = await guestbook.get();
      console.log(result.rows);
    } catch (err) {
      console.log(err);
    }

    console.log(result.rows);
    if (!result.rows || result.rows < 1) {
      $('#entries').html('No hay datos');
      return;
    }

    const context = {
      entries: result.rows
    }
    $('#entries').html(entriesTemplate(context));

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

