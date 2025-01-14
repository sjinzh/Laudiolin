import React from "react";

import { FiHeadphones } from "react-icons/all";

import BasicButton from "@components/common/BasicButton";

import type { OnlineUser, OfflineUser } from "@backend/types";
import { listeningWith, listenWith } from "@backend/social";
import { userData } from "@backend/user";
import { parseArtist } from "@backend/search";

import "@css/components/User.scss";

interface IProps {
    user: OnlineUser & OfflineUser;
    isOffline?: boolean;
}

class User extends React.PureComponent<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    /**
     * Formats a duration into a friendly time.
     * @param time The time in milliseconds.
     */
    formatTime(time: number) {
        const date = new Date(time);
        const now = new Date();

        const diff = now.getTime() - date.getTime();
        const diffYears = Math.floor(diff / (1000 * 3600 * 24 * 365));
        const diffMonths = Math.floor(diff / (1000 * 3600 * 24 * 30));
        const diffWeeks = Math.floor(diff / (1000 * 3600 * 24 * 7));
        const diffDays = Math.floor(diff / (1000 * 3600 * 24));
        const diffHours = Math.floor(diff / (1000 * 3600));
        const diffMinutes = Math.floor(diff / (1000 * 60));
        const diffSeconds = Math.floor(diff / 1000);

        if (diffYears > 1) return `${diffYears} years ago`;
        else if (diffYears == 1) return `${diffYears} year ago`;
        else if (diffMonths > 1) return `${diffMonths} months ago`;
        else if (diffMonths == 1) return `${diffMonths} month ago`;
        else if (diffWeeks > 1) return `${diffWeeks} weeks ago`;
        else if (diffWeeks == 1) return `${diffWeeks} week ago`;
        else if (diffDays > 1) return `${diffDays} days ago`;
        else if (diffDays == 1) return `${diffDays} day ago`;
        else if (diffHours > 1) return `${diffHours} hours ago`;
        else if (diffHours == 1) return `${diffHours} hour ago`;
        else if (diffMinutes > 1) return `${diffMinutes} minutes ago`;
        else if (diffMinutes == 1) return `${diffMinutes} minute ago`;
        else if (diffSeconds > 0) return `${diffSeconds} seconds ago`;
        else return "Just now";
    }

    render() {
        const { user } = this.props;
        if (user.userId == userData?.userId) return undefined;
        const listening = user.listeningTo ?? user.lastListeningTo;
        if (listening == null) return undefined;

        return (
            <div
                className={"User"}
                style={
                    this.props.isOffline && {
                        filter: "grayscale(1)",
                        opacity: 0.6,
                        pointerEvents: "none"
                    }
                }
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center"
                    }}
                >
                    <img
                        className={"User_Image"}
                        src={user.avatar}
                        alt={user.username}
                    />

                    <div className={"User_Info"}>
                        <div className={"User_Name"}>
                            <span>{user.username}</span>
                            <span>#{user.discriminator}</span>
                        </div>
                        <div className={"User_Listening"}>
                            <span>{listening.title}</span>
                            <span>{` • ${parseArtist(listening.artist)}`}</span>
                        </div>
                    </div>
                </div>

                {!this.props.isOffline ? (
                    <BasicButton
                        className={"User_Listen"}
                        icon={<FiHeadphones />}
                        onClick={() => {
                            if (listeningWith?.userId != user.userId) {
                                listenWith(user.userId);
                            } else {
                                listenWith(null);
                            }

                            this.forceUpdate();
                        }}
                        style={{
                            backgroundColor:
                                listeningWith?.userId == user.userId
                                    ? "var(--accent-color)"
                                    : "var(--background-secondary-color)"
                        }}
                    />
                ) : (
                    <p className={"User_RecentTime"}>
                        {this.formatTime(user.lastSeen)}
                    </p>
                )}
            </div>
        );
    }
}

export default User;
