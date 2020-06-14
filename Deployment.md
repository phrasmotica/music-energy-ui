# Deployment to Azure App Services

## Configuring site startup

Set the following app settings to the desired port number `P`:
- **PORT**
- **WEBSITES_PORT**

Ensure you run `az webapp config set --resource-group music-energy --name musicenergy --startup-file "npm i -g serve && serve -l <P> -s build"`, where `<P>` is the port number, in the cloud shell. Otherwise the site will attempt to start up with `npm start`, which is only the development server.
