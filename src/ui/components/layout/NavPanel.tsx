import React from "react";

import CurrentUser from "@components/nav/CurrentUser";
import NavPageList from "@components/nav/NavPageList";

import "@css/NavPanel.scss";

interface IProps {
    isLoggedIn: boolean;
}

class NavPanel extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div className={"NavPanel"}>
                <CurrentUser isLoggedIn={true} />
                <NavPageList />
            </div>
        );
    }
}

export default NavPanel;
