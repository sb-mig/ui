import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.scss";
import axios from "axios";
import {AIUrl} from './constants'

function App() {
    const [loading, setLoading] = useState(false);
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
      setLoading(true);
      // make request to AI
      // Send a POST request
      const response = await axios({
          method: 'post',
          url: AIUrl,
          headers: {
              Authorization: import.meta.env.VITE_AUTHORIZATION_TOKEN
          },
          data: {
              messages: [
                  { "role": "system", "content": "Translate next message to Polish" },
                  { "role": "user", "content": name }
              ]
          }
      });

      setLoading(false);

    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name: response?.data?.data?.content }));
  }

  return (
    <div className="container">
      <h1>Welcome to Wheatley!</h1>

      <div className="row">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a stuff to translate..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
        {
            loading ? (
                <div>Loading...</div>
                ) : (
                <div>
                    <h1>Response from <strong>Wheatley</strong></h1>
                    <p>{greetMsg}</p>
                </div>
            )
        }

    </div>
  );
}

export default App;
