import React, { useEffect } from "react";

import { IoMdPlay } from "react-icons/io";
import { MdShuffle } from "react-icons/md";
import { VscEllipsis } from "react-icons/vsc";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";

import Track from "@widget/Track";
import BasicButton from "@components/common/BasicButton";
import BasicDropdown, { toggleDropdown } from "@components/common/BasicDropdown";

import * as types from "@backend/types";
import { playPlaylist } from "@backend/audio";
import { deletePlaylist, getPlaylistAuthor } from "@backend/user";
import { savePlaylist } from "@backend/offline";
import { editPlaylist } from "@backend/playlist";
import { navigate } from "@backend/navigation";
import { notify } from "@backend/notifications";
import { reorder } from "@app/utils";

import "@css/pages/Playlist.scss";
import emitter from "@backend/events";

interface IProps {
    pageArgs: any;
}

function PlaylistAuthor(props: { playlist: types.Playlist }) {
    const playlist = props.playlist;
    const [author, setAuthor] = React.useState<types.PlaylistAuthor>(null);

    useEffect(() => {
        (async () => {
            setAuthor(await getPlaylistAuthor(playlist));
        })();
    }, []);

    return playlist ? (
        <div className={"Playlist_Author"}>
            <img
                className={"profile"}
                alt={playlist.owner}
                src={author?.icon ?? ""}
            />

            <p className={"username"}>{author?.name ?? ""}</p>
        </div>
    ) : undefined;
}

class Playlist extends React.Component<IProps, { playlist: types.Playlist }> {
    constructor(props: IProps) {
        super(props);

        this.state = { playlist: props.pageArgs };
    }

    /**
     * Returns the tracks in the playlist.
     */
    getPlaylistTracks(): types.TrackData[] {
        const playlist = this.getPlaylist();
        if (!playlist) return [];

        return (
            playlist.tracks
                // Remove duplicate tracks.
                .filter((track, index, self) => {
                    return self.findIndex((t) => t.id == track.id) == index;
                })
        );
    }

    /**
     * Fetches the playlist from the page arguments.
     */
    getPlaylist(): types.Playlist {
        const args = this.state.playlist ??
            this.props.pageArgs;
        if (!args) return undefined;
        return args as types.Playlist;
    }

    /**
     * Plays the playlist.
     * @param shuffle Whether to shuffle the playlist.
     */
    play(shuffle = false): void {
        playPlaylist(this.getPlaylist(), shuffle);
    }

    /**
     * Downloads the playlist for offline use.
     */
    download(): void {
        const playlist = this.getPlaylist();

        // Save the playlist.
        playlist && savePlaylist(playlist);

        // Send a notification.
        notify({
            type: "info",
            message: `Started download of playlist ${
                playlist?.name ?? "Unknown"
            }.`
        });
    }

    /**
     * Deletes the playlist.
     */
    delete(): void {
        const playlist = this.getPlaylist();

        // Delete the playlist.
        playlist && deletePlaylist(playlist.id);
        // Navigate to the home page.
        navigate("Home");
    }

    /**
     * Handles a drag & drop event.
     * @param result The drag & drop result.
     */
    handleDrag(result: DropResult): void {
        // Check for a valid drag result.
        if (!result.destination) return;

        // Get the playlist.
        const playlist = this.getPlaylist();
        if (playlist == undefined) return;

        // Re-order the playlist tracks.
        const tracks = playlist.tracks;
        // Update the playlist.
        playlist.tracks = reorder(
            tracks,
            result.source.index,
            result.destination.index
        );
        this.setState({ playlist });
        editPlaylist(playlist);
    }

    render() {
        const playlist = this.getPlaylist();
        if (!playlist) return undefined;

        return (
            <DragDropContext onDragEnd={result => this.handleDrag(result)}>
                <Droppable droppableId={"trackList"}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            <div className={"Playlist"}>
                                <div className={"Playlist_Details"}>
                                    <img
                                        className={"icon"}
                                        alt={playlist.name}
                                        src={playlist.icon}
                                    />

                                    <div className={"info"}>
                                        <p
                                            style={{
                                                textTransform: "uppercase",
                                                paddingTop: 28
                                            }}
                                        >
                                            {playlist.isPrivate
                                                ? "Private Playlist"
                                                : "Public Playlist"}
                                        </p>

                                        <h1 className={"info_title"}>
                                            {playlist.name}
                                        </h1>
                                        <p className={"info_description"}>
                                            {playlist.description}
                                        </p>

                                        <PlaylistAuthor playlist={playlist} />

                                        <div className={"Playlist_Actions"}>
                                            <BasicButton
                                                className={"action"}
                                                icon={<IoMdPlay />}
                                                onClick={() => this.play()}
                                            />

                                            <BasicButton
                                                className={"action"}
                                                icon={<MdShuffle />}
                                                onClick={() => this.play(true)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={"Playlist_Interact"}>
                                    <BasicButton
                                        className={"edit"}
                                        text={"Edit Playlist"}
                                    />

                                    <div className={"buttons"}>
                                        <BasicButton
                                            className={"dropbtn"}
                                            icon={<VscEllipsis />}
                                            onClick={() =>
                                                toggleDropdown(
                                                    "Playlist_Actions"
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <BasicDropdown id={"Playlist_Actions"}>
                                    <a onClick={() => this.download()}>Download Playlist</a>
                                    <a onClick={() => this.delete()}>Delete Playlist</a>
                                </BasicDropdown>

                                <div className={"Playlist_Tracks"}>
                                    {this.getPlaylistTracks().map(
                                        (track, index) => (
                                            <Draggable
                                                key={track.id}
                                                draggableId={track.id + index}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Track
                                                            track={track}
                                                            playlist={
                                                                playlist.id
                                                            }
                                                            key={index}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    )}
                                    {provided.placeholder}
                                </div>
                            </div>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

export default Playlist;
