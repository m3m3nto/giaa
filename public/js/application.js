var socket = io();
socket.on('updateUrl', function (data) {
  var uid = '';
  if(typeof data.id == 'undefined'){
    uid = '#';
  }else{
    uid = data.id;
  }

  var notifytime = data.notifytime ? moment(data.notifytime).format('DD-MM-YYYY HH:mm:ss') : '';

  $('#' + uid).remove();
  var element = '<tr id="' + uid + '" class="' + data.status + '">';
  element += '<td>' + uid + '</td>';
  element += '<td>' + data.location + '</td>';
  element += '<td>' + data.type + '</td>';
  element += '<td>' + data.response_status_code + '</td>';
  element += '<td>' + data.response_status_message + '</td>';
  element += '<td class="nowrap">' + notifytime + '</td>';
  element += '<td>' + data.status + '</td>';
  element += '<td class="nowrap">' + moment(data.updatedat).format('DD-MM-YYYY HH:mm:ss') + '</td>';
  element += '</tr>';
  $(element).insertBefore('#incr > tr:first');
});
