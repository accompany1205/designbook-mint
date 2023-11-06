import { useState, useCallback, useRef, useEffect } from "react";
import { Container, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { validateEmail } from "../helpers/email_validate";
import { Toast } from "primereact/toast";
export default function ContactUs() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef();
  const handleClickSendMessage = async () => {
    if (loading) return;
    if (!validateEmail(email)) {
      toast.current.show({
        severity: "error",
        summary: "Invalid Email Address.",
        detail: `Name: Error`,
        life: 3000,
      });
      return;
    }
    if (message.length < 40) {
      toast.current.show({
        severity: "error",
        summary: "Message should be more than 40 letters.",
        detail: `Name: Error`,
        life: 3000,
      });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/api/sendMessage`,
        {
          email,
          message,
        }
      );
      if (res && res.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Successfully Sent!",
          detail: `Name: Success`,
          life: 3000,
        });
        setEmail("");
        setMessage("");
      }
      setLoading(false);
    } catch (e) {
      toast.current.show({
        severity: "error",
        summary: "Message Sent Error",
        detail: `Name: Error`,
        life: 3000,
      });
      setLoading(false);
      return;
    }
  };

  return (
    <Container className="pt-5">
      <Toast ref={toast} />
      <h2 className="text-center fw-bold mt-3 mb-5">Contact us</h2>
      <div>
        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">
            Your email address*
          </label>
          <input
            type="email"
            className="form-control"
            placeholder="Type your email address"
            id="email"
            value={email}
            onChange={useCallback((e) => setEmail(e.target.value), [])}
          />
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">
            Your message*
          </label>
          <textarea
            type="text"
            className="form-control"
            placeholder="Type in your message"
            rows={5}
            id="message"
            value={message}
            onChange={useCallback((e) => setMessage(e.target.value), [])}
          />
        </div>
      </div>
      <button
        className="mb-3"
        style={{
          border: "1px solid #0F91D2",
          padding: "0.6em 6em",
          fontWeight: "bold",
          marginTop: "3em",
          borderRadius: 5,
          color: "#0F91D2",
          background: "transparent",
        }}
        onClick={() => handleClickSendMessage()}
      >
        {loading ? <Spinner /> : `SEND MESSAGE`}
      </button>
      <p className="mt-5" style={{color: '#959595'}}>
        Designbook information contact - admin@designbook.app
      </p>
    </Container>
  );
}
