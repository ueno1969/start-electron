import React, { useState } from "react";
import ReactDOM from "react-dom";

const { myAPI } = window;

const App: React.FC = () => {
    const [list, setList] = useState<string[]>([]);

    const onClickOpen = async () => {
        const filelist = await myAPI.openDialog();
        if (!filelist) return;

        setList(filelist);
    };

    return (
        <div>
            <button onClick={onClickOpen}>Open</button>
            <ul>
                {list.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
