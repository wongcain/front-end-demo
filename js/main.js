var GPLUS_BASE_URL = 'https://www.googleapis.com/plus/v1';
var GPLUS_API_KEY = 'AIzaSyBSvX-IdMvSnPtBdENuZXUEMljmG-tbtkU';

function getActivitiesForUser(userId, callback){
    gapi.client.load('plus', 'v1', function() {
      var request = gapi.client.plus.activities.list(
          {
            'userId': userId,
            'collection': 'public'
          }
        );
      request.execute(function(result) {
        if(result.items){
          callback(result.items);
        }
      });
  });
}

function getActivitiesBySearch(query, callback){
    gapi.client.load('plus', 'v1', function() {
      var request = gapi.client.plus.activities.search(
          {
            'query': query
          }
        );
      request.execute(function(result) {
        if(result.items){
          callback(result.items);
        }
      });
  });
}

function setLoading(){
  $('#loading').show();
  $('#activities').html('');
}

function displayGPlusActivities(activities){
  $('#loading').hide();
  activities.forEach(function(activity){
    var article = $('<article></article>');
    if(activity.object.attachments){
      activity.object.attachments.forEach(function(attachment){
        if(attachment.image){
          article.append('<img src="' + attachment.image.url + '">');
        }
      });
    }
    if(activity.object.content){
      article.append('<p>' + activity.object.content + '</p>');
    }
    $('#activities').append(article);
  });

}

function clearNavSelect(){
  $('#nav a').removeClass('active');
}

function init(){
  gapi.client.setApiKey(GPLUS_API_KEY);
  $( 'body' ).on( 'click', '#nav a', function(event) {
    clearNavSelect();
    var target = $(event.target);
    target.addClass('active');
    setLoading();
    if(target.attr('gplus-user-id')){
      $.ga.trackEvent({ category : 'GPlus', action : 'List', label : target.attr('gplus-user-id'), nonInteractive: false });
      getActivitiesForUser(target.attr('gplus-user-id'), displayGPlusActivities);
    } else if (target.attr('gplus-query')){
      $.ga.trackEvent({ category : 'GPlus', action : 'Search', label : target.attr('gplus-query'), nonInteractive: false });
      getActivitiesBySearch(target.attr('gplus-query'), displayGPlusActivities);
    }
  });
  getActivitiesForUser('+PaulIrish', displayGPlusActivities);
}