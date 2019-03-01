var socket = io();
socket.on('updateUrl', function (data) {
  var element = '<tr id="' + data.id + '">';
  element += '<td>' + data.id + '</td>';
  element += '<td>' + data.location + '</td>';
  element += '<td>' + data.type + '</td>';
  element += '<td>' + data.response_status_code + '</td>';
  element += '<td>' + data.response_status_message + '</td>';
  element += '<td class="nowrap">' + data.notifytime + '</td>';
  element += '<td>' + data.status + '</td>';
  element += '<td class="nowrap">' + data.updatedat + '</td>';
  element += '</tr>';
  $(element).insertBefore('#incr > tr:first').fadeIn(500);
});
