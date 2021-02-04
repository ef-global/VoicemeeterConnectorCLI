const VoiceMeeter = require('voicemeeter-connector');
const fs = require('fs');
const fsPromises = require('fs').promises
const xml2js = require('xml2js');

const devices = {
    microphone: 0,
    additionalHardware: 1,
    audioOutput: 2 // VB-Audio Voicemeeter VAIO
}

const method = {
    inside: 'inside',
    outside: 'outside'
}

const command = {
    muteMic: 'muteMic',
    unmuteMic: 'unmuteMic',
    muteMedia: 'muteMedia',
    unmuteMedia: 'unmuteMedia',
    generateSettings: 'generateSettings',
    other: 'other'
}

module.exports = async function (methodCmd, cmd, param2) {
    if (methodCmd === method.outside) {
        switch (cmd) {
            case command.generateSettings: {
                let bufferAudioDevices;
                let audioInput;
                let audioOutput;
                try {
                    bufferAudioDevices = await fsPromises.readFile(`./selectedAudioDevices.json`);

                    audioInput = JSON.parse(bufferAudioDevices).audioInput;
                    audioOutput = JSON.parse(bufferAudioDevices).audioOutput;


                } catch (e) {
                    console.log("error happened");
                    console.log(e)
                    throw e
                }

                const parser = new xml2js.Parser();
                fs.readFile('./Settings.xml', function (err, data) {
                    parser.parseString(data, function (err, result) {
                        console.dir(result);
                        console.log('Done');

                        // update input device (mic) name in xml file to selected one
                        result.VBAudioVoicemeeterSettings.VoiceMeeterDeviceConfiguration[0].InputDev[0]['$'].name = audioInput
                        result.VBAudioVoicemeeterSettings.VoiceMeeterDeviceConfiguration[0].OutputDev[0]['$'].name = audioOutput

                        const builder = new xml2js.Builder();
                        const xml = builder.buildObject(result);

                        fs.writeFile('./VirtualOfficeSettings.xml', xml, (err) => {
                            console.log("is it working ? ")
                            console.log(err)
                        });
                    });
                });
                break;
            }

            case command.other:
                console.log("different case...");
                break;
        }

    } else {
        VoiceMeeter.default.init().then(vm => {
            // Connect to your Voicemeeter client
            vm.connect();

            function toggleMicrophone(mute) {
                vm.setStripParameter(devices.microphone, VoiceMeeter.StripProperties.Mute, mute ? 1 : 0);
            }

            function getMuteMicrophoneStatus() {
                return vm.getStripParameter(devices.microphone, VoiceMeeter.StripProperties.Mute);
            }

            function getMuteAudioOutputStatus() {
                return vm.getStripParameter(devices.audioOutput, VoiceMeeter.StripProperties.Mute);
            }

            function toggleAudioOutput(mute) {
                vm.setStripParameter(devices.audioOutput, VoiceMeeter.StripProperties.Mute, mute ? 1 : 0);
            }

            function setAudioOutputVolume(volume) {
                vm.setStripParameter(devices.audioOutput, VoiceMeeter.StripProperties.Gain, volume);
            }

            function getGainFromAudioOutput() {
                return vm.getStripParameter(devices.audioOutput, VoiceMeeter.StripProperties.Gain);
            }

            function setMicrophoneGain(gain) {
                vm.setStripParameter(devices.microphone, VoiceMeeter.StripProperties.Gain, gain);
            }

            function getGainFromMicrophone() {
                return vm.getStripParameter(devices.microphone, VoiceMeeter.StripProperties.Gain);
            }

            switch (cmd) {
                case command.muteMic:
                    toggleMicrophone(true)
                    console.log("Microphone muted")
                    break;
                case command.unmuteMic:
                    toggleMicrophone(false)
                    console.log("Microphone unmuted")
                    break;
                case command.muteMedia:
                    toggleAudioOutput(true)
                    console.log("Audio unmuted")
                    break;
                case command.unmuteMedia:
                    toggleAudioOutput(false)
                    console.log("Audio unmuted")
                    break;
                case 'volumeUp':
                    setAudioOutputVolume(30)
                    console.log("Audio Output volumed UP")
                    break;
                case 'volumeDown':
                    setAudioOutputVolume(-30)
                    console.log("Audio Output volumed DOWN")
                    break;
                case 'microphoneGainUp':
                    setMicrophoneGain(12)
                    console.log("Microphone Gain UP")
                    break;
                case 'microphoneGainDown':
                    setMicrophoneGain(-30)
                    console.log("Microphone Gain DOWN")
                    break;
                case 'getAudioOutputGain':
                    const gainFromAudioOutput = getGainFromAudioOutput()
                    console.log("Current gain from Audio Output: ", gainFromAudioOutput)
                    break;
                case 'getMicrophoneGain':
                    const gainFromMicrophone = getGainFromMicrophone()
                    console.log("Current gain from Microphone: ", gainFromMicrophone)
                    break;
                case 'getMuteMicrophoneStatus':
                    const microphoneMuteStatus = getMuteMicrophoneStatus()
                    console.log("Current mute status from Microphone: ", microphoneMuteStatus)
                    break;
                case 'getMuteAudioOutputStatus':
                    const audioOutputMuteStatus = getMuteAudioOutputStatus()
                    console.log("Current mute status from Audio Output: ", audioOutputMuteStatus)
                    break;

                default:
                    console.log("No changes")
                    break;
            }

            //Disconnect voicemeeter client
            setTimeout(vm.disconnect, 100);
        });
    }

    return true
}
