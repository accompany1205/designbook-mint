import { Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function ContactUs() {
  return (
    <Container className="pt-5">
      <h2>Contact Us</h2>
      <div className="mt-3 mb-3">
        <p>
          You can contact us on{" "}
          <Link to="mailto:admin@designbook.app">
            admin@designbook.app
          </Link>
        </p>
      </div>
    </Container>
  );
}
