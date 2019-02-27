# Deployment

Great - now we have a working app! Let's get it off our local machine and out into the world. There are many ways to deploy an app; today we are going to cover two of them.

## surge

http://surge.sh/

https://github.com/kiwiupover/ember-cli-surge

- stop app (`ctrl+C`)
- `ember install ember-cli-surge`
- come up with something-unique for your website url
- `ember g surge-domain ambitious-arcgis-app-<something-unique>.surge.sh`
  - when asked if you would like to overwrite CNAME, respond 'y' for yes
- `ember surge --environment=development`
  - create an account when prompted, if you do not already have a surge account
- visit `ambitious-arcgis-app-<something-unique>.surge.sh`

## ember-cli-deploy (demo)

http://ember-cli-deploy.com/


- `ember install ember-cli-deploy`

- [have an s3 account, create buckets, create the .env file, & .gitignore it!]
- Lots of intervening steps including

config/deploy.js ==>

```js

module.exports = function(deployTarget) {
  var ENV = {
    's3': {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: 'ambitious-arcgis-app',
      region: 'us-east-1'
    },
    's3-index': {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: 'ambitious-arcgis-app-index',
      region: 'us-east-1'
    }
  };

  return ENV;
};
```

...more intervening steps eventually leading to the promised land

- `ember deploy <environment> --activate`
