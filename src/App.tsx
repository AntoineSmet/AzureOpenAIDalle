//React
import { useState } from "react";
//Axios
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [urlData, setURLData] = useState<any | null>(null);

  const makeRequest = async () => {
    setLoading(true);
    const apiUrl = `${
      import.meta.env.VITE_AZURE_OPENAI_URL_BASE as string
    }/openai/images/generations:submit?api-version=2023-06-01-preview`;
    const apiKey = `${import.meta.env.VITE_AZURE_OPENAI_KEY as string}`;
    const requestBody = {
      prompt: prompt,
      n: 1,
      size: "512x512",
    };

    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "api-key": apiKey,
        },
      });
      await getRequestData(response.data.id);
    } catch (error) {
      console.error("Error making the request:", error);
    }
  };

  const getRequestData = async (id: string) => {
    const getApiUrl = `${
      import.meta.env.VITE_AZURE_OPENAI_URL_BASE as string
    }/openai/operations/images/${id}?api-version=2023-06-01-preview`;

    try {
      const response = await axios.get(getApiUrl, {
        headers: {
          "api-key": import.meta.env.VITE_AZURE_OPENAI_KEY as string,
        },
      });
      if (response.data.status === "succeeded") {
        setURLData(response.data.result.data[0].url);
        setLoading(false);
      } else {
        setTimeout(() => getRequestData(id), 1000);
      }
    } catch (error) {
      console.error("Error making the GET request:", error);
    }
  };

  return (
    <div className="container">
      <div className="main-content">
        <div className="input-container">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Your prompt"
          />
          <button className="nav-link" onClick={makeRequest}>
            Show picture
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          urlData && <img src={urlData} />
        )}
      </div>
    </div>
  );
}

export default App;
