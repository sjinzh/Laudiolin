import React from "react";

import Navigate from "@components/Navigate";

import * as audio from "@backend/audio";
import { navigate } from "@backend/navigation";

interface IState {
    lightTheme: boolean;
}

class MainView extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            lightTheme: false
        }
    }

    toggleTheme = () => {
        if (!this.state.lightTheme) {
            document.getElementsByTagName("html")[0].setAttribute("data-theme", "light");
            this.setState({ lightTheme: true });
        } else {
            document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");
            this.setState({ lightTheme: false });
        }
    };

    playAudio = () => {
        audio.playTrack({
            "title": "Hikaru Nara (光るなら) - Genshin Chinese VAs || Colour Coded Lyrics (Kan/Rom/Eng)",
            "artist": "tamothyy",
            "icon": "https://i.ytimg.com/vi/eF6preXfMHw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLArxygPfKEt3uJ0oLe8DhjEi3QFiQ",
            "url": "https://youtu.be/eF6preXfMHw",
            "id": "eF6preXfMHw",
            "duration": 248
        });
    };

    search = () => {
        navigate("Search");
    };

    render() {
        return (
            <div className={"MainView"}>
                <Navigate />

                <button onClick={this.toggleTheme}>Toggle Theme</button>
                <button onClick={this.playAudio}>play audio</button>
                <button onClick={this.search}>search</button>
            </div>
        );
    }
}

export default MainView;