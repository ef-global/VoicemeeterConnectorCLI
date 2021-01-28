const VoiceMeeter = require('voicemeeter-connector');

const devices = {
    microphone: 0,
    additionalHardware: 1,
    audioOutput: 2 // VB-Audio Voicemeeter VAIO
}

module.exports = function(cmd) {
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
            case 'mute':
                toggleMicrophone(true)
                console.log("Microphone muted")
                break;
            case 'unmute':
                toggleMicrophone(false)
                console.log("Microphone unmuted")
                break;
            case 'muteAudio':
                toggleAudioOutput(true)
                console.log("Audio unmuted")
                break;
            case 'unmuteAudio':
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
