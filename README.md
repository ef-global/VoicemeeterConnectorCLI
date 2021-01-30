This is [Virtual Office](https://github.com/ef-global/electron-poc) companion CLI app, to manage all stuff related to communication with [Voicemeeter](https://www.google.com/search?client=safari&rls=en&q=voicemeeter&ie=UTF-8&oe=UTF-8) app.

you in
## API
```
voicemeeter-helper.exe outside generateSettings
```
base on audioInputs.json and audioOutputs.json and default Settings.xml (all 3 files has to be in place where you invoke an app), it will create custom .XML file with whole configuration

```
voicemeeter-helper.exe inside muteMic
```
 will send request to mute microphone

```
voicemeeter-helper.exe inside unMuteMic
```
 will send request to unmute microphone
 

More methods to come.

## Development
The most important information about this app is that it runs with `Node 10` which is requirements for some modules used inside, which communicate with Voicemeeter and require this version of Node.

### Debug
To run app without compiling, make sure that you are using `node 10` (for example with `nvm`), and run

```
node bin.js [command]
```


### Build
Other than that, to compile `.exe` file, we use [pkg](https://www.npmjs.com/package/pkg), you can compile new version of app by running

```
npm install - to install dependencies
```

```
npm run pkg - to build .exe file for windows
```
