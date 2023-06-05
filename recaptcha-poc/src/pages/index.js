import { useRef, useState } from "react";

export default function Home() {
  const nameRef = useRef();
  const [response, setResponse] = useState({})
  async function submitHandler(e) {
    e.preventDefault();
    try {
      const name = nameRef.current.value;
      const token = grecaptcha.getResponse();
      const configs = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          response: token,
        }),
      };

      const res = await fetch("/verify", configs);
      const data = await res.json();
      
      if(!data.status.success){
        alert("Captcha Verification Failed - Unauthorized");
        return;
      }

      alert("Captcha Verification Successful!✅✅");
      setResponse(data)
      nameRef.current.value = "";
    } catch (err) {
      console.log(err);
    }
  }

  return (
      <div
        className="home"
        style={{
          margin: "auto",
          display: "flex",
          width: "400px",
          border: "2px solid grey",
          textAlign: "center",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "90vh",
          borderRadius: "10px" 
        }}
      >
        <h1>ReCaptcha POC</h1>
        <form
          style={{
            display: "flex",
            textAlign: "center",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            borderRadius: "10px",
            padding: "5px",
          }}
        >
          <label
            htmlFor="name"
            style={{
              fontSize: "1.3rem",
              outline: "none",
              padding: "7px",
              borderRadius: "5px",
            }}
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter Your Name"
            style={{
              fontSize: "1.3rem",
              outline: "none",
              padding: "7px",
              borderRadius: "5px",
              margin: "10px",
            }}
            ref={nameRef}
          />
          <div
            id="real"
            className="g-recaptcha"
            data-sitekey={process.env.SITE_KEY}
          ></div>
          <br />
          <input
            onClick={submitHandler}
            type="button"
            value="Submit"
            style={{
              fontSize: "1rem",
              padding: "10px",
              borderRadius: "7px",
              margin: "auto",
              display: "block",
              cursor: "pointer"
            }}
          />
        </form>

        <div className="response">
          <h3>Here&apos;s your response!</h3>
          <code
            className="response__content"
            style={{
              width: "240px",
              height: "170px",
              background: "#fff297",
              borderRadius: "7px",
            }}
          >{JSON.stringify(response, undefined, 2)}</code>
        </div>
      </div>
  );
}
