import React from "react";

import AnimatedView from "@components/common/AnimatedView";
import TrackList from "@components/TrackList";

import { recents } from "@backend/user";

class Recents extends React.Component {
    render() {
        return recents.length > 0 ? (
            <AnimatedView>
                <TrackList
                    title={"Recents"}
                    events={["login", "recent"]}
                    collection={() => recents}
                />
            </AnimatedView>
        ) : (
            <AnimatedView className={"empty"}>
                <h1>No Recents</h1>
                <p>Come back here after you play something.</p>
            </AnimatedView>
        );
    }
}

export default Recents;
