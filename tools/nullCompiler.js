// mock weback require for some resources
function noop() {
  return null;
}
require.extensions['.css'] = noop;
require.extensions['.less'] = noop;
require.extensions['.png'] = noop;
require.extensions['.jpg'] = noop;
