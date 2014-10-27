var is_new_tab = false;

var _importMap = function() 
{
  console.log('Import map from setting');  
  var map = safari.extension.settings.map;
  localStorage.omniquicksearch = JSON.stringify({"map": JSON.parse(map)});
}

var handleChange = function(Event) 
{
  console.log('Settings had been changed')
  _importMap();
}

var handleSearch = function(Event) 
{
  // Event.preventDefault();
  var query = Event.query.trim();
  console.log('Search for', query);  
  var query_array = query.split(' ');
  var keyword = query_array.shift();
  var map = JSON.parse(localStorage.omniquicksearch).map;

  if(!!map[keyword])
  {
    if(!!is_new_tab) 
    {
      safari.application.activeBrowserWindow.activeTab.close();
    }

    if(query_array.length > 0) 
    {
      var url = map[keyword];
      url = url.replace(/\{\{search\}\}/g, query_array.join('+'));
      safari.application.activeBrowserWindow.openTab().url = url;
    } 
    else
    {
      safari.application.activeBrowserWindow.openTab().url = map[keyword];
    }  
  }
}

var handleActivate = function(Event) 
{
  is_new_tab = !safari.application.activeBrowserWindow.activeTab.url;
}

_importMap();
safari.extension.settings.addEventListener('change', handleChange, true);
safari.application.addEventListener('beforeSearch', handleSearch, true);
safari.application.addEventListener('activate', handleActivate, true);