# Deployment to Azure App Services

## Configuring app settings

Set the following app settings:
- **REACT_APP_API_URL** - URL of the Music Energy API

## Configuring site startup

Set the following app settings to the desired port number `P`:
- **PORT**
- **WEBSITES_PORT**

Ensure you run `az webapp config set --resource-group <groupName> --name <appName> --startup-file "npm i -g serve && serve -l <P> -s build"`, where `<P>` is the port number, in the cloud shell. Otherwise the site will attempt to start up with `npm start`, which is only the development server.

## Enabling HTTPS redirection

Enable HTTPS Only in the TLS/SSL settings panel.
