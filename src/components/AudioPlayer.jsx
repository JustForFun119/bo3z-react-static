import React from 'react'
import PropTypes from 'prop-types'
// UI Components
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Slider from 'material-ui/Slider';
import PlayIcon from 'material-ui/svg-icons/av/play-arrow';
import PauseIcon from 'material-ui/svg-icons/av/pause';

const styles = {
    Paper: {
        display: 'inline-block',
        width: 64,
        height: 64,
        textAlign: 'center',
    },
    Slider: {
        marginTop: 16,
        marginBottom: 0
    },
};
const iconButtonStyles = {
    iconStyle: {
        width: 36,
        height: 36
    },
    style: {
        width: 64,
        height: 64,
        verticalAlign: 'middle'
    }
};

function audioTimeUpdateListener(audio) {
    this.setState({ progress: audio.currentTime / audio.duration });
}

export default class AudioPlayer extends React.Component {
    constructor(props) {
        super(props);
        // init audio element
        const audioElement = new Audio(props.audioFile); // HTML audio element
        audioElement.autoplay = false; // manual play : user-controlled
        audioElement.volume = props.volume; // default to volume in props
        this.state = {
            audio: audioElement,
            isPlaying: false,
            progress: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        // reset audio if audio source changed on next props
        if (this.props.audioFile !== nextProps.audioFile) {
            const audio = this.state.audio;
            audio.src = nextProps.audioFile; // set new audio source
            audio.load(); // reset audio element
        }
    }

    // init/cleanup audio on mount/unmount
    componentDidMount() { this.initAudio(); }
    componentWillUnmount() { this.cleanupAudio(); }

    initAudio() {
        const audio = this.state.audio;
        // listen to audio progress/time update
        audio.addEventListener('timeupdate', audioTimeUpdateListener.bind(this, audio));
    }

    cleanupAudio() {
        const audio = this.state.audio;
        // remove audio progress/time update listener
        audio.removeEventListener('timeupdate', audioTimeUpdateListener.bind(this, audio));
        audio.pause(); // pause/stop audio
    }

    play() {
        this.state.audio.play();
        this.setState({ isPlaying: this.state.audio.paused });
    }

    pause() {
        this.state.audio.pause();
        this.setState({ isPlaying: this.state.audio.paused });
    }

    onSliderChange(evt, newValue) {
        const audio = this.state.audio;
        // seek and play at slider handle position
        audio.currentTime = audio.duration * newValue;
    }

    render() {
        return (
            <div style={this.props.style}>
                <Paper style={styles.Paper} circle={true}>
                    {this.state.audio.paused ?
                        <IconButton
                            onClick={() => { this.play(); }}
                            {...iconButtonStyles}><PlayIcon /></IconButton> :
                        <IconButton
                            onClick={() => { this.pause(); }}
                            {...iconButtonStyles}><PauseIcon /></IconButton>}
                </Paper>
                <Slider value={this.state.progress} onChange={this.onSliderChange.bind(this)}
                    sliderStyle={styles.Slider} />
            </div>
        );
    }
}
AudioPlayer.propTypes = {
    audioFile: PropTypes.string,
    volume: PropTypes.number,
    style: PropTypes.object
}