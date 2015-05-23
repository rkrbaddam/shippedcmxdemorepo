# cmxdemo
Sample application accessing a Cisco CMX Mobility Services server

## Server Installation

The server is a node.js application.  To run, install node.js then:

> cd server
> npm install
> node server

The default port is 3000.  Edit config.json to change it.

## Local Methods
/local/config - Specify server configuration

The server supports one local method, /local/config, a POST method that
requiring a JSON argument specifying values for one or more of the
configuration values username, password, authToken, cmxServer, and virtualize.
If username or password is provided, the server generates a new authToken
and ignores any external specification.  To specify a new authToken explicitly,
set username to "-".

The response to /local/config is JSON containing the new configuration,
including any generated authToken

## Pass-Through Methods
All URLs not specifying a local method are passed unaltered to the
CMX server and receive its response.

## Server Virtualization
The server passes all requests to a remote CMX server.  If a remote CMX
server is unavailable, or if you want predictable responses to a subset of
the server methods, activate server virtualization support by setting
virtualize: true in config.json.  When virtualization is active, the server
fulfils requests from the JSON data files in the testData directory.  

The following methods are available with virtualization active:

* /api/location/v1/clients/count       - number of clients
* /api/location/v1/clients             - detailed info on all clients
* /api/location/v1/clients/xxx         - detailed info on the client with MAC address xxx
* /api/location/v1/history/clients/xxx - location history for the client with MAC address xxx
* /api/config/v1/maps/imagesource/xxx  - image of map xxx (currently always returns "not found")
